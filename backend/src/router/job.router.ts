import { Router } from "express";
import { 
    searchJobs,
    getAllNCOCodes,
    getNCOCodeById,
    submitSearchFeedback,
    markResultViewed,
    getPopularSearches,
    getRecommendedNCOCodes,
} from "../controller/job.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/nco-codes", getAllNCOCodes);
router.get("/nco-codesId/:id", getNCOCodeById);
router.get("/popular-searches", getPopularSearches);
router.get("/recommendations", getRecommendedNCOCodes);

// Protected routes (require authentication)
router.post("/search", authenticate, searchJobs);
router.post("/feedback", authenticate, submitSearchFeedback);
router.put("/results/:resultId/viewed", authenticate, markResultViewed);
export default router;
