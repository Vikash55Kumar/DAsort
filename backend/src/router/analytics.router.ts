import { Router } from "express";
import { 
    getSearchTrends,
    getPopularNCOCodes,
    getUserEngagement,
    getPerformanceMetrics,
    getFeedbackAnalytics
} from "../controller/analytics.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Public analytics (no authentication required)
router.get("/search-trends", getSearchTrends);
router.get("/popular-nco-codes", authenticate, getPopularNCOCodes);
router.get("/feedback", getFeedbackAnalytics);

// Protected analytics (require authentication)
router.get("/user-engagement", authenticate, getUserEngagement);

// Admin analytics (require admin role)
router.get("/performance", authenticate, getPerformanceMetrics);

export default router;
