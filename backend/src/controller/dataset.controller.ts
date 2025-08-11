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

interface DatasetCreateRequest {
    name: string;
    description?: string;
    type: 'NCO_MASTER_DATA' | 'SURVEY_DATA' | 'BULK_CLASSIFICATION' | 'USER_UPLOAD' | 'TRAINING_DATA';
    originalFileName?: string;
    fileSize?: number;
    fileUrl?: string;
    mimeType?: string;
}

interface BulkRecordRequest {
    records: Array<{
        originalData: any;
        suggestedCodeId?: string;
        confidenceScore?: number;
        isVerified?: boolean;
    }>;
}

// ============================================================================
// DATASET MANAGEMENT
// ============================================================================

const createDataset = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const {
        name,
        description,
        type,
        originalFileName,
        fileSize,
        fileUrl,
        mimeType
    }: DatasetCreateRequest = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!name || !type) {
        throw new ApiError(400, "Dataset name and type are required.");
    }

    // Validate dataset type
    const validTypes = ['NCO_MASTER_DATA', 'SURVEY_DATA', 'BULK_CLASSIFICATION', 'USER_UPLOAD', 'TRAINING_DATA'];
    if (!validTypes.includes(type)) {
        throw new ApiError(400, "Invalid dataset type.");
    }

    try {
        const dataset = await prisma.dataset.create({
            data: {
                name,
                description,
                type,
                originalFileName,
                fileSize,
                fileUrl,
                mimeType,
                createdBy: userId
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.status(201).json(
            new ApiResponse(201, dataset, "Dataset created successfully")
        );

    } catch (error) {
        console.error("Error creating dataset:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during dataset creation.");
    }
});

const getAllDatasets = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { 
        page = 1, 
        limit = 10, 
        type, 
        status, 
        createdBy,
        own = false 
    } = req.query;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    try {
        const skip = (Number(page) - 1) * Number(limit);
        
        const whereClause: any = {};
        
        // Filter by type
        if (type) whereClause.type = type;
        
        // Filter by status
        if (status) whereClause.status = status;
        
        // Filter by creator
        if (createdBy && userRole === 'ADMIN') {
            whereClause.createdBy = createdBy;
        }
        
        // Show only user's own datasets if requested or if not admin
        if (own === 'true' || userRole !== 'ADMIN') {
            whereClause.createdBy = userId;
        }

        const [datasets, totalCount] = await Promise.all([
            prisma.dataset.findMany({
                where: whereClause,
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    _count: {
                        select: {
                            records: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.dataset.count({ where: whereClause })
        ]);

        res.status(200).json(
            new ApiResponse(200, {
                datasets,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / Number(limit))
                }
            }, "Datasets retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving datasets:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

const getDatasetById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!id) {
        throw new ApiError(400, "Dataset ID is required.");
    }

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                records: {
                    take: 10, // Sample records
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        originalData: true,
                        isProcessed: true,
                        hasErrors: true,
                        isVerified: true,
                        confidenceScore: true,
                        createdAt: true
                    }
                },
                _count: {
                    select: {
                        records: true
                    }
                }
            }
        });

        if (!dataset) {
            throw new ApiError(404, "Dataset not found.");
        }

        // Check authorization - users can only see their own datasets unless admin
        if (userRole !== 'ADMIN' && dataset.createdBy !== userId) {
            throw new ApiError(403, "Access denied to this dataset.");
        }

        res.status(200).json(
            new ApiResponse(200, dataset, "Dataset retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving dataset:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error.");
    }
});

const updateDataset = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;
    const { name, description, status } = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!id) {
        throw new ApiError(400, "Dataset ID is required.");
    }

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id }
        });

        if (!dataset) {
            throw new ApiError(404, "Dataset not found.");
        }

        // Check authorization
        if (userRole !== 'ADMIN' && dataset.createdBy !== userId) {
            throw new ApiError(403, "Access denied to this dataset.");
        }

        const updatedDataset = await prisma.dataset.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(status && { status })
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.status(200).json(
            new ApiResponse(200, updatedDataset, "Dataset updated successfully")
        );

    } catch (error) {
        console.error("Error updating dataset:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during dataset update.");
    }
});

const deleteDataset = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const { id } = req.params;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!id) {
        throw new ApiError(400, "Dataset ID is required.");
    }

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        records: true
                    }
                }
            }
        });

        if (!dataset) {
            throw new ApiError(404, "Dataset not found.");
        }

        // Check authorization
        if (userRole !== 'ADMIN' && dataset.createdBy !== userId) {
            throw new ApiError(403, "Access denied to this dataset.");
        }

        // Prevent deletion if dataset is being processed
        if (dataset.status === 'AI_PROCESSING' || dataset.status === 'VALIDATING') {
            throw new ApiError(400, "Cannot delete dataset while it's being processed.");
        }

        await prisma.dataset.delete({
            where: { id }
        });

        res.status(200).json(
            new ApiResponse(200, null, "Dataset deleted successfully")
        );

    } catch (error) {
        console.error("Error deleting dataset:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during dataset deletion.");
    }
});

// ============================================================================
// DATA RECORD MANAGEMENT
// ============================================================================

const addDataRecords = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { id: datasetId } = req.params;
    const { records }: BulkRecordRequest = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!datasetId) {
        throw new ApiError(400, "Dataset ID is required.");
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
        throw new ApiError(400, "Records array is required and cannot be empty.");
    }

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id: datasetId }
        });

        if (!dataset) {
            throw new ApiError(404, "Dataset not found.");
        }

        // Check authorization
        if (req.user?.role !== 'ADMIN' && dataset.createdBy !== userId) {
            throw new ApiError(403, "Access denied to this dataset.");
        }

        // Create records in batch
        const createdRecords = await prisma.dataRecord.createMany({
            data: records.map(record => ({
                datasetId,
                originalData: record.originalData,
                suggestedCodeId: record.suggestedCodeId,
                confidenceScore: record.confidenceScore,
                isVerified: record.isVerified || false,
                isProcessed: !!record.suggestedCodeId
            }))
        });

        // Update dataset counters
        await prisma.dataset.update({
            where: { id: datasetId },
            data: {
                totalRecords: {
                    increment: records.length
                },
                processedRecords: {
                    increment: records.filter(r => r.suggestedCodeId).length
                }
            }
        });

        res.status(201).json(
            new ApiResponse(201, {
                createdCount: createdRecords.count,
                datasetId
            }, "Data records added successfully")
        );

    } catch (error) {
        console.error("Error adding data records:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during data record creation.");
    }
});

const getDataRecords = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { id: datasetId } = req.params;
    const { 
        page = 1, 
        limit = 20,
        isProcessed,
        hasErrors,
        isVerified 
    } = req.query;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!datasetId) {
        throw new ApiError(400, "Dataset ID is required.");
    }

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id: datasetId }
        });

        if (!dataset) {
            throw new ApiError(404, "Dataset not found.");
        }

        // Check authorization
        if (req.user?.role !== 'ADMIN' && dataset.createdBy !== userId) {
            throw new ApiError(403, "Access denied to this dataset.");
        }

        const skip = (Number(page) - 1) * Number(limit);
        
        const whereClause: any = { datasetId };
        if (isProcessed !== undefined) whereClause.isProcessed = isProcessed === 'true';
        if (hasErrors !== undefined) whereClause.hasErrors = hasErrors === 'true';
        if (isVerified !== undefined) whereClause.isVerified = isVerified === 'true';

        const [records, totalCount] = await Promise.all([
            prisma.dataRecord.findMany({
                where: whereClause,
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.dataRecord.count({ where: whereClause })
        ]);

        res.status(200).json(
            new ApiResponse(200, {
                records,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / Number(limit))
                }
            }, "Data records retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving data records:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

const verifyDataRecord = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { recordId } = req.params;
    const { manualCodeId, isVerified } = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!recordId) {
        throw new ApiError(400, "Record ID is required.");
    }

    try {
        const record = await prisma.dataRecord.findUnique({
            where: { id: recordId },
            include: {
                dataset: true
            }
        });

        if (!record) {
            throw new ApiError(404, "Data record not found.");
        }

        // Check authorization
        if (req.user?.role !== 'ADMIN' && record.dataset.createdBy !== userId) {
            throw new ApiError(403, "Access denied to this record.");
        }

        const updatedRecord = await prisma.dataRecord.update({
            where: { id: recordId },
            data: {
                manualCodeId,
                isVerified: isVerified !== undefined ? isVerified : true,
                verifiedBy: userId,
                verifiedAt: new Date()
            }
        });

        res.status(200).json(
            new ApiResponse(200, updatedRecord, "Data record verified successfully")
        );

    } catch (error) {
        console.error("Error verifying data record:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during record verification.");
    }
});

// ============================================================================
// DATASET PROCESSING & AI INTEGRATION
// ============================================================================

const processDataset = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { id: datasetId } = req.params;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!datasetId) {
        throw new ApiError(400, "Dataset ID is required.");
    }

    try {
        const dataset = await prisma.dataset.findUnique({
            where: { id: datasetId },
            include: {
                _count: {
                    select: {
                        records: true
                    }
                }
            }
        });

        if (!dataset) {
            throw new ApiError(404, "Dataset not found.");
        }

        // Check authorization
        if (req.user?.role !== 'ADMIN' && dataset.createdBy !== userId) {
            throw new ApiError(403, "Access denied to this dataset.");
        }

        // Check if dataset can be processed
        if (dataset.status === 'AI_PROCESSING' || dataset.status === 'VALIDATING') {
            throw new ApiError(400, "Dataset is already being processed.");
        }

        if (dataset._count.records === 0) {
            throw new ApiError(400, "Cannot process empty dataset.");
        }

        // Update dataset status
        await prisma.dataset.update({
            where: { id: datasetId },
            data: {
                status: 'READY_FOR_AI',
                aiProcessingStarted: new Date()
            }
        });

        // TODO: Here you would call the Python AI service
        // For now, we'll just mark it as ready
        
        res.status(200).json(
            new ApiResponse(200, {
                datasetId,
                status: 'READY_FOR_AI',
                totalRecords: dataset._count.records
            }, "Dataset queued for AI processing")
        );

    } catch (error) {
        console.error("Error processing dataset:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during dataset processing.");
    }
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
    createDataset,
    getAllDatasets,
    getDatasetById,
    updateDataset,
    deleteDataset,
    addDataRecords,
    getDataRecords,
    verifyDataRecord,
    processDataset
};
