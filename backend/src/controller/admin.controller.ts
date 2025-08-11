import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { ApiError } from '../utility/ApiError';
import ApiResponse from '../utility/ApiResponse';
import { asyncHandler } from '../utility/asyncHandler';

// Types
interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

interface NCOCodeCreateRequest {
    ncoCode: string;
    title: string;
    description: string;
    majorGroup: string;
    subMajorGroup: string;
    minorGroup: string;
    unitGroup: string;
    sector?: string;
    skillLevel?: string;
    educationLevel?: string;
    keywords?: string[];
    synonyms?: string[];
    version?: string;
}

interface SystemConfigRequest {
    key: string;
    value: string;
    description?: string;
    category?: string;
    dataType?: string;
    isPublic?: boolean;
}

// Middleware to check admin role
const requireAdmin = (req: AuthRequest, res: Response, next: any) => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }
    next();
};

// ============================================================================
// DASHBOARD & ANALYTICS
// ============================================================================

const getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    try {
        const [
            userStats,
            searchStats,
            datasetStats,
            ncoStats,
            recentActivity
        ] = await Promise.all([
            // User statistics
            prisma.user.groupBy({
                by: ['role'],
                _count: { role: true }
            }),
            
            // Search statistics (last 7 days)
            prisma.searchHistory.aggregate({
                where: {
                    searchedAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                },
                _count: { id: true },
                _avg: { processingTime: true }
            }),
            
            // Dataset statistics
            prisma.dataset.groupBy({
                by: ['status'],
                _count: { status: true }
            }),
            
            // NCO code statistics
            prisma.nCOCode.aggregate({
                _count: { id: true },
                where: { isActive: true }
            }),
            
            // Recent activity (last 24 hours)
            prisma.auditLog.findMany({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 20
            })
        ]);

        const dashboardData = {
            users: {
                total: userStats.reduce((sum, stat) => sum + stat._count.role, 0),
                byRole: userStats.reduce((acc, stat) => {
                    acc[stat.role] = stat._count.role;
                    return acc;
                }, {} as any)
            },
            searches: {
                total: searchStats._count.id,
                avgProcessingTime: searchStats._avg.processingTime
            },
            datasets: {
                byStatus: datasetStats.reduce((acc, stat) => {
                    acc[stat.status] = stat._count.status;
                    return acc;
                }, {} as any)
            },
            ncoCodes: {
                total: ncoStats._count.id
            },
            recentActivity: recentActivity
        };

        res.status(200).json(
            new ApiResponse(200, dashboardData, "Dashboard statistics retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving dashboard stats:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

const getAnalytics = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { startDate, endDate, language, region } = req.query;

    try {
        const whereClause: any = {};
        
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) whereClause.date.gte = new Date(startDate as string);
            if (endDate) whereClause.date.lte = new Date(endDate as string);
        }
        
        if (language) whereClause.language = language;
        if (region) whereClause.region = region;

        const analytics = await prisma.searchAnalytics.findMany({
            where: whereClause,
            orderBy: { date: 'desc' },
            take: 30 // Last 30 data points
        });

        res.status(200).json(
            new ApiResponse(200, analytics, "Analytics data retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving analytics:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// NCO CODE MANAGEMENT
// ============================================================================

const createNCOCode = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const {
        ncoCode,
        title,
        description,
        majorGroup,
        subMajorGroup,
        minorGroup,
        unitGroup,
        sector,
        skillLevel,
        educationLevel,
        keywords = [],
        synonyms = [],
        version = "NCO-2015"
    }: NCOCodeCreateRequest = req.body;

    if (!ncoCode || !title || !description || !majorGroup || !subMajorGroup || !minorGroup || !unitGroup) {
        throw new ApiError(400, "All required NCO code fields must be provided.");
    }

    // Validate NCO code format (8 digits)
    if (!/^\d{8}$/.test(ncoCode)) {
        throw new ApiError(400, "NCO code must be exactly 8 digits.");
    }

    try {
        // Check if NCO code already exists
        const existingCode = await prisma.nCOCode.findUnique({
            where: { ncoCode }
        });

        if (existingCode) {
            throw new ApiError(400, "NCO code already exists.");
        }

        const newNCOCode = await prisma.nCOCode.create({
            data: {
                ncoCode,
                title,
                description,
                majorGroup,
                subMajorGroup,
                minorGroup,
                unitGroup,
                sector,
                skillLevel,
                educationLevel,
                keywords,
                synonyms,
                version,
                isVerified: true // Admin-created codes are auto-verified
            }
        });

        res.status(201).json(
            new ApiResponse(201, newNCOCode, "NCO code created successfully")
        );

    } catch (error) {
        console.error("Error creating NCO code:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during NCO code creation.");
    }
});

const updateNCOCode = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
        throw new ApiError(400, "NCO code ID is required.");
    }

    try {
        const existingCode = await prisma.nCOCode.findUnique({
            where: { id }
        });

        if (!existingCode) {
            throw new ApiError(404, "NCO code not found.");
        }

        const updatedCode = await prisma.nCOCode.update({
            where: { id },
            data: updateData
        });

        res.status(200).json(
            new ApiResponse(200, updatedCode, "NCO code updated successfully")
        );

    } catch (error) {
        console.error("Error updating NCO code:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during NCO code update.");
    }
});

const deleteNCOCode = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "NCO code ID is required.");
    }

    try {
        const existingCode = await prisma.nCOCode.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        searchResults: true,
                        feedbacks: true
                    }
                }
            }
        });

        if (!existingCode) {
            throw new ApiError(404, "NCO code not found.");
        }

        // Soft delete if there are references
        if (existingCode._count.searchResults > 0 || existingCode._count.feedbacks > 0) {
            await prisma.nCOCode.update({
                where: { id },
                data: { isActive: false }
            });
            
            res.status(200).json(
                new ApiResponse(200, null, "NCO code deactivated successfully (soft delete due to existing references)")
            );
        } else {
            await prisma.nCOCode.delete({
                where: { id }
            });
            
            res.status(200).json(
                new ApiResponse(200, null, "NCO code deleted successfully")
            );
        }

    } catch (error) {
        console.error("Error deleting NCO code:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during NCO code deletion.");
    }
});

const bulkImportNCOCodes = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { codes } = req.body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
        throw new ApiError(400, "NCO codes array is required and cannot be empty.");
    }

    try {
        let successCount = 0;
        let errorCount = 0;
        const errors: any[] = [];

        for (const codeData of codes) {
            try {
                await prisma.nCOCode.create({
                    data: {
                        ...codeData,
                        isVerified: true,
                        version: codeData.version || "NCO-2015"
                    }
                });
                successCount++;
            } catch (error) {
                errorCount++;
                errors.push({
                    code: codeData.ncoCode,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        res.status(200).json(
            new ApiResponse(200, {
                successCount,
                errorCount,
                errors: errors.slice(0, 10) // Return first 10 errors
            }, `Bulk import completed: ${successCount} successful, ${errorCount} failed`)
        );

    } catch (error) {
        console.error("Error during bulk import:", error);
        throw new ApiError(500, "Internal server error during bulk import.");
    }
});

// ============================================================================
// SYSTEM CONFIGURATION
// ============================================================================

const getSystemConfigs = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { category, isPublic } = req.query;

    try {
        const whereClause: any = {};
        if (category) whereClause.category = category;
        if (isPublic !== undefined) whereClause.isPublic = isPublic === 'true';

        const configs = await prisma.systemConfig.findMany({
            where: whereClause,
            orderBy: [
                { category: 'asc' },
                { key: 'asc' }
            ]
        });

        res.status(200).json(
            new ApiResponse(200, configs, "System configurations retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving system configs:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

const updateSystemConfig = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const {
        key,
        value,
        description,
        category = "general",
        dataType = "string",
        isPublic = false
    }: SystemConfigRequest = req.body;

    if (!key || value === undefined) {
        throw new ApiError(400, "Configuration key and value are required.");
    }

    try {
        const config = await prisma.systemConfig.upsert({
            where: { key },
            update: {
                value,
                description,
                category,
                dataType,
                isPublic
            },
            create: {
                key,
                value,
                description,
                category,
                dataType,
                isPublic
            }
        });

        res.status(200).json(
            new ApiResponse(200, config, "System configuration updated successfully")
        );

    } catch (error) {
        console.error("Error updating system config:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during configuration update.");
    }
});

// ============================================================================
// AUDIT LOGS
// ============================================================================

const getAuditLogs = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { 
        page = 1, 
        limit = 50,
        action,
        resourceType,
        userId,
        startDate,
        endDate,
        success
    } = req.query;

    try {
        const skip = (Number(page) - 1) * Number(limit);
        
        const whereClause: any = {};
        if (action) whereClause.action = action;
        if (resourceType) whereClause.resourceType = resourceType;
        if (userId) whereClause.userId = userId;
        if (success !== undefined) whereClause.success = success === 'true';
        
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
            if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
        }

        const [logs, totalCount] = await Promise.all([
            prisma.auditLog.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.auditLog.count({ where: whereClause })
        ]);

        res.status(200).json(
            new ApiResponse(200, {
                logs,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / Number(limit))
                }
            }, "Audit logs retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving audit logs:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// API REQUEST MONITORING
// ============================================================================

const getAPIRequests = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { 
        page = 1, 
        limit = 50,
        serviceName,
        status,
        startDate,
        endDate
    } = req.query;

    try {
        const skip = (Number(page) - 1) * Number(limit);
        
        const whereClause: any = {};
        if (serviceName) whereClause.serviceName = serviceName;
        if (status) whereClause.status = status;
        
        if (startDate || endDate) {
            whereClause.createdAt = {};
            if (startDate) whereClause.createdAt.gte = new Date(startDate as string);
            if (endDate) whereClause.createdAt.lte = new Date(endDate as string);
        }

        const [requests, totalCount] = await Promise.all([
            prisma.aPIRequest.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.aPIRequest.count({ where: whereClause })
        ]);

        res.status(200).json(
            new ApiResponse(200, {
                requests,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / Number(limit))
                }
            }, "API requests retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving API requests:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
    getDashboardStats,
    getAnalytics,
    createNCOCode,
    updateNCOCode,
    deleteNCOCode,
    bulkImportNCOCodes,
    getSystemConfigs,
    updateSystemConfig,
    getAuditLogs,
    getAPIRequests
};
