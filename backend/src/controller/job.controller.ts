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

interface SearchJobRequest {
    query: string;
    language?: string;
    inputMethod?: 'TEXT' | 'VOICE' | 'API';
    sessionId?: string;
    limit?: number;
}

interface SearchFeedbackRequest {
    searchId: string;
    selectedCodeId?: string;
    rating?: number;
    isCorrect?: boolean;
    wasHelpful?: boolean;
    comments?: string;
    correctionReason?: string;
    suggestedKeywords?: string[];
    reportedIssue?: string;
}

// ============================================================================
// JOB SEARCH FUNCTIONALITY (Main feature)
// ============================================================================

const searchJobs = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { 
        query, 
        language = "en", 
        inputMethod = "TEXT",
        sessionId,
        limit = 10 
    }: SearchJobRequest = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!query || query.trim().length === 0) {
        throw new ApiError(400, "Search query is required.");
    }

    try {
        // Create search history record
        const searchHistory = await prisma.searchHistory.create({
            data: {
                userId,
                query: query.trim(),
                language,
                inputMethod,
                sessionId,
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip
            }
        });

        // TODO: Call Python AI service for semantic search
        // For now, we'll do a basic keyword search as fallback
        const basicResults = await prisma.nCOCode.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { keywords: { hasSome: query.toLowerCase().split(' ') } },
                    { synonyms: { hasSome: query.toLowerCase().split(' ') } }
                ],
                isActive: true
            },
            take: limit,
            orderBy: [
                { isVerified: 'desc' },
                { title: 'asc' }
            ]
        });

        // Create search results with basic scoring
        const searchResults = await Promise.all(
            basicResults.map(async (ncoCode, index) => {
                return await prisma.searchResult.create({
                    data: {
                        searchId: searchHistory.id,
                        ncoCodeId: ncoCode.id,
                        relevanceScore: 0.8 - (index * 0.1), // Simple scoring
                        confidenceScore: 0.7 - (index * 0.05),
                        rank: index + 1,
                        matchType: 'KEYWORD', // Default for basic search
                        matchedKeywords: query.toLowerCase().split(' '),
                        explanation: `Matched keywords in ${ncoCode.title}`
                    },
                    include: {
                        ncoCode: {
                            select: {
                                id: true,
                                ncoCode: true,
                                title: true,
                                description: true,
                                majorGroup: true,
                                subMajorGroup: true,
                                minorGroup: true,
                                unitGroup: true,
                                sector: true,
                                skillLevel: true,
                                educationLevel: true,
                                keywords: true,
                                version: true
                            }
                        }
                    }
                });
            })
        );

        // Update search history with results count
        await prisma.searchHistory.update({
            where: { id: searchHistory.id },
            data: {
                totalResults: searchResults.length,
                aiServiceStatus: 'success' // TODO: Update based on AI service call
            }
        });

        res.status(200).json(
            new ApiResponse(200, {
                searchId: searchHistory.id,
                query,
                totalResults: searchResults.length,
                results: searchResults,
                processingTime: Date.now() - searchHistory.searchedAt.getTime()
            }, "Job search completed successfully")
        );

    } catch (error) {
        console.error("Error during job search:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during job search.");
    }
});

// ============================================================================
// NCO CODE MANAGEMENT
// ============================================================================

const getAllNCOCodes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { 
        page = 1, 
        limit = 20, 
        majorGroup, 
        sector, 
        skillLevel,
        search,
        isActive = 'true' //currently string
    } = req.query;

    try {
        const skip = (Number(page) - 1) * Number(limit);
        
        const whereClause: any = { isActive: isActive === 'true' };
        if (majorGroup) whereClause.majorGroup = majorGroup;
        if (sector) whereClause.sector = sector;
        if (skillLevel) whereClause.skillLevel = skillLevel;
        if (search) {
            whereClause.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { ncoCode: { contains: search as string } },
                { description: { contains: search as string, mode: 'insensitive' } }
            ];
        }

        const [ncoCodes, totalCount] = await Promise.all([
            prisma.nCOCode.findMany({
                where: whereClause,
                select: {
                    id: true,
                    ncoCode: true,
                    title: true,
                    description: true,
                    majorGroup: true,
                    subMajorGroup: true,
                    minorGroup: true,
                    unitGroup: true,
                    sector: true,
                    skillLevel: true,
                    educationLevel: true,
                    version: true,
                    isVerified: true,
                    createdAt: true
                },
                orderBy: { ncoCode: 'asc' },
                skip,
                take: Number(limit)
            }),
            prisma.nCOCode.count({ where: whereClause })
        ]);

        res.status(200).json(
            new ApiResponse(200, {
                ncoCodes,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / Number(limit))
                }
            }, "NCO codes retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving NCO codes:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

const getNCOCodeById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "NCO Code ID is required.");
    }

    try {
        const ncoCode = await prisma.nCOCode.findUnique({
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

        if (!ncoCode) {
            throw new ApiError(404, "NCO Code not found.");
        }

        res.status(200).json(
            new ApiResponse(200, ncoCode, "NCO code retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving NCO code:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// SEARCH FEEDBACK & LEARNING
// ============================================================================

const submitSearchFeedback = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const {
        searchId,
        selectedCodeId,
        rating,
        isCorrect,
        wasHelpful,
        comments,
        correctionReason,
        suggestedKeywords = [],
        reportedIssue
    }: SearchFeedbackRequest = req.body;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!searchId) {
        throw new ApiError(400, "Search ID is required.");
    }

    try {
        // Verify search belongs to user
        const searchHistory = await prisma.searchHistory.findFirst({
            where: {
                id: searchId,
                userId
            }
        });

        if (!searchHistory) {
            throw new ApiError(404, "Search not found or not authorized.");
        }

        // Check if feedback already exists
        const existingFeedback = await prisma.searchFeedback.findUnique({
            where: { searchId }
        });

        if (existingFeedback) {
            throw new ApiError(400, "Feedback already submitted for this search.");
        }

        // Create feedback
        const feedback = await prisma.searchFeedback.create({
            data: {
                userId,
                searchId,
                selectedCodeId,
                rating: rating ? Math.max(1, Math.min(5, rating)) : null,
                isCorrect,
                wasHelpful,
                comments,
                correctionReason,
                suggestedKeywords,
                reportedIssue
            },
            include: {
                selectedCode: {
                    select: {
                        ncoCode: true,
                        title: true
                    }
                }
            }
        });

        // Update search result interaction if a code was selected
        if (selectedCodeId) {
            await prisma.searchResult.updateMany({
                where: {
                    searchId,
                    ncoCodeId: selectedCodeId
                },
                data: {
                    wasSelected: true,
                    selectedAt: new Date()
                }
            });
        }

        res.status(201).json(
            new ApiResponse(201, feedback, "Feedback submitted successfully")
        );

    } catch (error) {
        console.error("Error submitting feedback:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error during feedback submission.");
    }
});

// ============================================================================
// SEARCH RESULT INTERACTIONS
// ============================================================================

const markResultViewed = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { resultId } = req.params;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    if (!resultId) {
        throw new ApiError(400, "Result ID is required.");
    }

    try {
        // Verify the search result belongs to the user
        const searchResult = await prisma.searchResult.findFirst({
            where: {
                id: resultId,
                search: {
                    userId
                }
            }
        });

        if (!searchResult) {
            throw new ApiError(404, "Search result not found or not authorized.");
        }

        // Update view status
        const updatedResult = await prisma.searchResult.update({
            where: { id: resultId },
            data: {
                wasViewed: true,
                viewedAt: new Date()
            }
        });

        res.status(200).json(
            new ApiResponse(200, updatedResult, "Result marked as viewed")
        );

    } catch (error) {
        console.error("Error marking result as viewed:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// POPULAR SEARCHES & RECOMMENDATIONS
// ============================================================================

const getPopularSearches = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit = 10, language = "en", days = 7 } = req.query;

    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Number(days));

        // Get popular search queries
        const popularQueries = await prisma.searchHistory.groupBy({
            by: ['query'],
            where: {
                searchedAt: {
                    gte: startDate
                },
                language: language as string,
                totalResults: {
                    gt: 0
                }
            },
            _count: {
                query: true
            },
            orderBy: {
                _count: {
                    query: 'desc'
                }
            },
            take: Number(limit)
        });

        res.status(200).json(
            new ApiResponse(200, {
                popularQueries: popularQueries.map(item => ({
                    query: item.query,
                    searchCount: item._count.query
                })),
                period: `Last ${days} days`,
                language
            }, "Popular searches retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving popular searches:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

const getRecommendedNCOCodes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { limit = 10, sector, skillLevel } = req.query;

    try {
        const whereClause: any = { 
            isActive: true,
            isVerified: true 
        };
        
        if (sector) whereClause.sector = sector;
        if (skillLevel) whereClause.skillLevel = skillLevel;
        const recommendedCodes = await prisma.nCOCode.findMany({
            where: whereClause,
            select: {
                id: true,
                ncoCode: true,
                title: true,
                description: true,
                sector: true,
                skillLevel: true,
                keywords: true,
                synonyms: true,
                _count: {
                    select: {
                        searchResults: true
                    }
                }
            },
            orderBy: [
                { searchResults: { _count: 'desc' } },
                { isVerified: 'desc' },
                { title: 'asc' }
            ],
            take: Number(limit)
        });

        res.status(200).json(
            new ApiResponse(200, recommendedCodes, "Recommended NCO codes retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving recommendations:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
    searchJobs,
    getAllNCOCodes,
    getNCOCodeById,
    submitSearchFeedback,
    markResultViewed,
    getPopularSearches,
    getRecommendedNCOCodes,
};
