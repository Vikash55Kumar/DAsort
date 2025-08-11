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

// ============================================================================
// SEARCH ANALYTICS
// ============================================================================

const getSearchTrends = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { 
        period = '7d', // 7d, 30d, 90d
        language = 'en',
        region
    } = req.query;

    try {
        let days = 7;
        if (period === '30d') days = 30;
        if (period === '90d') days = 90;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const whereClause: any = {
            searchedAt: { gte: startDate }
        };
        if (language) whereClause.language = language;
        if (region) whereClause.user = { region };

        // Daily search counts
        const dailyStats = await prisma.$queryRaw`
            SELECT 
                DATE(searched_at) as date,
                COUNT(*) as total_searches,
                COUNT(DISTINCT user_id) as unique_users,
                AVG(processing_time) as avg_processing_time,
                AVG(total_results) as avg_results
            FROM search_history 
            WHERE searched_at >= ${startDate}
            ${language ? `AND language = ${language}` : ''}
            GROUP BY DATE(searched_at)
            ORDER BY date DESC
        `;

        // Top search queries
        const topQueries = await prisma.searchHistory.groupBy({
            by: ['query'],
            where: whereClause,
            _count: { query: true },
            orderBy: { _count: { query: 'desc' } },
            take: 10
        });

        // Success rate trends
        const successStats = await prisma.searchHistory.groupBy({
            by: ['aiServiceStatus'],
            where: whereClause,
            _count: { aiServiceStatus: true }
        });

        res.status(200).json(
            new ApiResponse(200, {
                period,
                dailyStats,
                topQueries: topQueries.map(q => ({
                    query: q.query,
                    count: q._count.query
                })),
                successStats,
                totalSearches: topQueries.reduce((sum, q) => sum + q._count.query, 0)
            }, "Search trends retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving search trends:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

const getPopularNCOCodes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { 
        period = '30d',
        limit = 20,
        sector,
        skillLevel
    } = req.query;

    try {
        let days = 30;
        if (period === '7d') days = 7;
        if (period === '90d') days = 90;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const whereClause: any = {
            createdAt: { gte: startDate }
        };

        // Popular NCO codes by search results
        const popularCodes = await prisma.searchResult.groupBy({
            by: ['ncoCodeId'],
            where: whereClause,
            _count: { ncoCodeId: true },
            _avg: { relevanceScore: true, confidenceScore: true },
            orderBy: { _count: { ncoCodeId: 'desc' } },
            take: Number(limit)
        });

        // Get NCO code details
        const codeIds = popularCodes.map(pc => pc.ncoCodeId);
        const ncoCodeDetails = await prisma.nCOCode.findMany({
            where: { 
                id: { in: codeIds },
                ...(sector && { sector: sector as string }),
                ...(skillLevel && { skillLevel: skillLevel as string })
            },
            select: {
                id: true,
                ncoCode: true,
                title: true,
                sector: true,
                skillLevel: true,
                majorGroup: true
            }
        });

        // Combine data
        const result = popularCodes.map(pc => {
            const codeDetail = ncoCodeDetails.find(ncd => ncd.id === pc.ncoCodeId);
            return {
                ...codeDetail,
                searchCount: pc._count.ncoCodeId,
                avgRelevanceScore: pc._avg.relevanceScore,
                avgConfidenceScore: pc._avg.confidenceScore
            };
        }).filter(item => item.ncoCode); // Filter out codes that don't match sector/skillLevel

        res.status(200).json(
            new ApiResponse(200, {
                period,
                popularCodes: result,
                totalCodes: result.length
            }, "Popular NCO codes retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving popular NCO codes:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// USER ANALYTICS
// ============================================================================

const getUserEngagement = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    const { period = '30d' } = req.query;

    // Only admins can see all user analytics, regular users see their own
    const isAdmin = req.user?.role === 'ADMIN';
    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "User not authenticated.");
    }

    try {
        let days = 30;
        if (period === '7d') days = 7;
        if (period === '90d') days = 90;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const whereClause: any = {
            searchedAt: { gte: startDate }
        };

        if (!isAdmin) {
            whereClause.userId = userId;
        }

        // User activity metrics
        const userActivity = await prisma.searchHistory.groupBy({
            by: ['userId'],
            where: whereClause,
            _count: { userId: true },
            _avg: { processingTime: true },
            orderBy: { _count: { userId: 'desc' } },
            take: isAdmin ? 50 : 1
        });

        // Get user details
        const userIds = userActivity.map(ua => ua.userId);
        const userDetails = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                name: true,
                email: true,
                region: true,
                role: true,
                createdAt: true
            }
        });

        // Feedback metrics
        const feedbackStats = await prisma.searchFeedback.groupBy({
            by: ['userId'],
            where: {
                createdAt: { gte: startDate },
                ...(isAdmin ? {} : { userId })
            },
            _count: { userId: true },
            _avg: { rating: true }
        });

        // Combine data
        const engagementData = userActivity.map(ua => {
            const userDetail = userDetails.find(ud => ud.id === ua.userId);
            const feedbackStat = feedbackStats.find(fs => fs.userId === ua.userId);
            
            return {
                user: userDetail,
                searchCount: ua._count.userId,
                avgProcessingTime: ua._avg.processingTime,
                feedbackCount: feedbackStat?._count.userId || 0,
                avgRating: feedbackStat?._avg.rating || null
            };
        });

        res.status(200).json(
            new ApiResponse(200, {
                period,
                userEngagement: engagementData,
                totalActiveUsers: userActivity.length
            }, "User engagement data retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving user engagement:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// PERFORMANCE ANALYTICS
// ============================================================================

const getPerformanceMetrics = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (req.user?.role !== 'ADMIN') {
        throw new ApiError(403, "Admin access required.");
    }

    const { period = '24h' } = req.query;

    try {
        let hours = 24;
        if (period === '7d') hours = 24 * 7;
        if (period === '30d') hours = 24 * 30;

        const startDate = new Date();
        startDate.setHours(startDate.getHours() - hours);

        // API request performance
        const apiPerformance = await prisma.aPIRequest.aggregate({
            where: {
                createdAt: { gte: startDate }
            },
            _count: { id: true },
            _avg: { responseTime: true }
        });

        // Search performance
        const searchPerformance = await prisma.searchHistory.aggregate({
            where: {
                searchedAt: { gte: startDate }
            },
            _count: { id: true },
            _avg: { processingTime: true }
        });

        // Error rates
        const errorStats = await prisma.searchHistory.groupBy({
            by: ['aiServiceStatus'],
            where: {
                searchedAt: { gte: startDate }
            },
            _count: { aiServiceStatus: true }
        });

        // System health metrics
        const healthMetrics = {
            apiRequests: {
                total: apiPerformance._count?.id || 0,
                avgDuration: apiPerformance._avg?.responseTime || 0
            },
            searches: {
                total: searchPerformance._count?.id || 0,
                avgProcessingTime: searchPerformance._avg?.processingTime || 0
            },
            errorRate: {
                breakdown: errorStats,
                totalErrors: errorStats.filter(stat => stat.aiServiceStatus !== 'success')
                    .reduce((sum, stat) => sum + stat._count.aiServiceStatus, 0),
                totalRequests: errorStats.reduce((sum, stat) => sum + stat._count.aiServiceStatus, 0)
            }
        };

        res.status(200).json(
            new ApiResponse(200, {
                period,
                healthMetrics,
                timestamp: new Date()
            }, "Performance metrics retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving performance metrics:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// FEEDBACK ANALYTICS
// ============================================================================

const getFeedbackAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { period = '30d', minRating, maxRating } = req.query;

    try {
        let days = 30;
        if (period === '7d') days = 7;
        if (period === '90d') days = 90;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const whereClause: any = {
            createdAt: { gte: startDate }
        };

        if (minRating) whereClause.rating = { gte: Number(minRating) };
        if (maxRating) {
            if (whereClause.rating) {
                whereClause.rating.lte = Number(maxRating);
            } else {
                whereClause.rating = { lte: Number(maxRating) };
            }
        }

        // Rating distribution
        const ratingDistribution = await prisma.searchFeedback.groupBy({
            by: ['rating'],
            where: whereClause,
            _count: { rating: true },
            orderBy: { rating: 'asc' }
        });

        // Correctness metrics
        const correctnessStats = await prisma.searchFeedback.groupBy({
            by: ['isCorrect'],
            where: whereClause,
            _count: { isCorrect: true }
        });

        // Helpfulness metrics
        const helpfulnessStats = await prisma.searchFeedback.groupBy({
            by: ['wasHelpful'],
            where: whereClause,
            _count: { wasHelpful: true }
        });

        // Recent comments
        const recentComments = await prisma.searchFeedback.findMany({
            where: {
                ...whereClause,
                comments: { not: null }
            },
            select: {
                comments: true,
                rating: true,
                isCorrect: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        region: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        res.status(200).json(
            new ApiResponse(200, {
                period,
                ratingDistribution,
                correctnessStats,
                helpfulnessStats,
                recentComments,
                totalFeedbacks: ratingDistribution.reduce((sum, rd) => sum + rd._count.rating, 0)
            }, "Feedback analytics retrieved successfully")
        );

    } catch (error) {
        console.error("Error retrieving feedback analytics:", error);
        throw new ApiError(500, "Internal server error.");
    }
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
    getSearchTrends,
    getPopularNCOCodes,
    getUserEngagement,
    getPerformanceMetrics,
    getFeedbackAnalytics
};
