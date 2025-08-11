import { Router } from "express";
import { 
    getSearchTrends,
    getPopularNCOCodes,
    getUserEngagement,
    getPerformanceMetrics,
    getFeedbackAnalytics
} from "../controller/analytics.controller";

const router = Router();

// Public analytics (no authentication required)
router.get("/search-trends", getSearchTrends);
router.get("/popular-nco-codes", getPopularNCOCodes);
router.get("/feedback", getFeedbackAnalytics);

// Protected analytics (require authentication)
router.get("/user-engagement", getUserEngagement);

// Admin analytics (require admin role)
router.get("/performance", getPerformanceMetrics);

export default router;
