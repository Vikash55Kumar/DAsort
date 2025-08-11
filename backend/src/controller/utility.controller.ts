import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { ApiError } from '../utility/ApiError';
import ApiResponse from '../utility/ApiResponse';
import { asyncHandler } from '../utility/asyncHandler';

// ============================================================================
// HEALTH CHECK & STATUS
// ============================================================================

const healthCheck = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        // Check database connectivity
        await prisma.$queryRaw`SELECT 1`;
        
        // Check basic system status
        const systemStatus = {
            database: 'connected',
            timestamp: new Date().toISOString(),
            version: process.env.APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        };

        res.status(200).json(
            new ApiResponse(200, systemStatus, "System is healthy")
        );

    } catch (error) {
        console.error("Health check failed:", error);
        throw new ApiError(503, "System health check failed");
    }
});

const getSystemStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        // Get basic system statistics
        const [
            userCount,
            ncoCodeCount,
            searchCount,
            datasetCount
        ] = await Promise.all([
            prisma.user.count({ where: { isActive: true } }),
            prisma.nCOCode.count({ where: { isActive: true } }),
            prisma.searchHistory.count(),
            prisma.dataset.count()
        ]);

        // Get recent activity
        const recentSearches = await prisma.searchHistory.count({
            where: {
                searchedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            }
        });

        const systemStats = {
            users: {
                total: userCount,
                active: userCount // Assuming all users are active for simplicity
            },
            ncoCodes: {
                total: ncoCodeCount
            },
            searches: {
                total: searchCount,
                last24Hours: recentSearches
            },
            datasets: {
                total: datasetCount
            },
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date().toISOString()
        };

        res.status(200).json(
            new ApiResponse(200, systemStats, "System status retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving system status:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// PUBLIC CONFIGURATION
// ============================================================================

const getPublicConfig = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const publicConfigs = await prisma.systemConfig.findMany({
            where: { isPublic: true },
            select: {
                key: true,
                value: true,
                dataType: true,
                category: true
            }
        });

        // Transform config array to object for easier frontend consumption
        const configObject = publicConfigs.reduce((acc, config) => {
            let value: any = config.value;
            
            // Parse value based on data type
            switch (config.dataType) {
                case 'number':
                    value = Number(config.value);
                    break;
                case 'boolean':
                    value = config.value === 'true';
                    break;
                case 'json':
                    try {
                        value = JSON.parse(config.value);
                    } catch {
                        value = config.value;
                    }
                    break;
                default:
                    value = config.value;
            }

            acc[config.key] = value;
            return acc;
        }, {} as any);

        res.status(200).json(
            new ApiResponse(200, configObject, "Public configuration retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving public config:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// SEARCH SUGGESTIONS & AUTOCOMPLETE
// ============================================================================

const getSearchSuggestions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { query, limit = 10, language = 'en' } = req.query;

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
        throw new ApiError(400, "Query must be at least 2 characters long.");
    }

    try {
        const searchTerm = query.trim().toLowerCase();
        
        // Get suggestions from NCO titles and keywords
        const suggestions = await prisma.nCOCode.findMany({
            where: {
                AND: [
                    { isActive: true },
                    {
                        OR: [
                            { title: { contains: searchTerm, mode: 'insensitive' } },
                            { keywords: { hasSome: [searchTerm] } },
                            { synonyms: { hasSome: [searchTerm] } }
                        ]
                    }
                ]
            },
            select: {
                ncoCode: true,
                title: true,
                keywords: true
            },
            take: Number(limit)
        });

        // Get popular search queries that match
        const popularQueries = await prisma.searchHistory.findMany({
            where: {
                query: { contains: searchTerm, mode: 'insensitive' },
                language: language as string,
                totalResults: { gt: 0 }
            },
            select: { query: true },
            distinct: ['query'],
            take: 5,
            orderBy: { searchedAt: 'desc' }
        });

        // Format suggestions
        const formattedSuggestions = suggestions.map(nco => ({
            type: 'nco_title',
            text: nco.title,
            ncoCode: nco.ncoCode,
            relevantKeywords: nco.keywords.filter(k => 
                k.toLowerCase().includes(searchTerm)
            )
        }));

        const querysSuggestions = popularQueries.map(pq => ({
            type: 'popular_query',
            text: pq.query
        }));

        res.status(200).json(
            new ApiResponse(200, {
                suggestions: [...formattedSuggestions, ...querysSuggestions],
                query: searchTerm,
                totalSuggestions: formattedSuggestions.length + querysSuggestions.length
            }, "Search suggestions retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving search suggestions:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// DATA VALIDATION & UTILITIES
// ============================================================================

const validateNCOCode = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { ncoCode } = req.params;

    if (!ncoCode) {
        throw new ApiError(400, "NCO code is required.");
    }

    // Validate format (8 digits)
    if (!/^\d{8}$/.test(ncoCode)) {
        res.status(200).json(
            new ApiResponse(200, {
                isValid: false,
                reason: "NCO code must be exactly 8 digits",
                format: "12345678"
            }, "NCO code validation completed")
        );
        return;
    }

    try {
        // Check if code exists in database
        const existingCode = await prisma.nCOCode.findUnique({
            where: { ncoCode },
            select: {
                id: true,
                ncoCode: true,
                title: true,
                isActive: true,
                isVerified: true
            }
        });

        if (existingCode) {
            res.status(200).json(
                new ApiResponse(200, {
                    isValid: true,
                    exists: true,
                    code: existingCode,
                    isActive: existingCode.isActive,
                    isVerified: existingCode.isVerified
                }, "NCO code validation completed")
            );
        } else {
            res.status(200).json(
                new ApiResponse(200, {
                    isValid: true,
                    exists: false,
                    suggestion: "Valid format but code not found in database"
                }, "NCO code validation completed")
            );
        }

    } catch (error) {
        console.error("Error validating NCO code:", error);
        throw new ApiError(500, "Internal server error during validation.");
    }
});

const getNCOHierarchy = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { level = 'major' } = req.query; // major, subMajor, minor, unit

    try {
        let groupBy: string[];
        let selectFields: any;

        switch (level) {
            case 'major':
                groupBy = ['majorGroup'];
                selectFields = { majorGroup: true };
                break;
            case 'subMajor':
                groupBy = ['majorGroup', 'subMajorGroup'];
                selectFields = { majorGroup: true, subMajorGroup: true };
                break;
            case 'minor':
                groupBy = ['majorGroup', 'subMajorGroup', 'minorGroup'];
                selectFields = { majorGroup: true, subMajorGroup: true, minorGroup: true };
                break;
            case 'unit':
                groupBy = ['majorGroup', 'subMajorGroup', 'minorGroup', 'unitGroup'];
                selectFields = { majorGroup: true, subMajorGroup: true, minorGroup: true, unitGroup: true };
                break;
            default:
                throw new ApiError(400, "Invalid hierarchy level. Use: major, subMajor, minor, unit");
        }

        const hierarchy = await prisma.nCOCode.groupBy({
            by: groupBy as any,
            where: { isActive: true },
            _count: { id: true },
            orderBy: groupBy.reduce((acc, field) => {
                acc[field] = 'asc';
                return acc;
            }, {} as any)
        });

        // Get sample titles for each group
        const hierarchyWithTitles = await Promise.all(
            hierarchy.map(async (group) => {
                const whereClause = Object.keys(selectFields).reduce((acc, field) => {
                    acc[field] = (group as any)[field];
                    return acc;
                }, {} as any);

                const sampleCode = await prisma.nCOCode.findFirst({
                    where: { ...whereClause, isActive: true },
                    select: { title: true, ncoCode: true }
                });

                return {
                    ...group,
                    sampleTitle: sampleCode?.title,
                    sampleCode: sampleCode?.ncoCode,
                    codeCount: group._count.id
                };
            })
        );

        res.status(200).json(
            new ApiResponse(200, {
                level,
                hierarchy: hierarchyWithTitles,
                totalGroups: hierarchy.length
            }, "NCO hierarchy retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving NCO hierarchy:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
    healthCheck,
    getSystemStatus,
    getPublicConfig,
    getSearchSuggestions,
    validateNCOCode,
    getNCOHierarchy
};
