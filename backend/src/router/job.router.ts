import { Router } from "express";
import { 
    searchJobs,
    getAllNCOCodes,
    getNCOCodeById,
    submitSearchFeedback,
    markResultViewed,
    getPopularSearches,
    getRecommendedNCOCodes
} from "../controller/job.controller";

const router = Router();

// Public routes
router.get("/nco-codes", getAllNCOCodes);
router.get("/nco-codes/:id", getNCOCodeById);
router.get("/popular-searches", getPopularSearches);
router.get("/recommendations", getRecommendedNCOCodes);

// Protected routes (require authentication)
router.post("/search", searchJobs);
router.post("/feedback", submitSearchFeedback);
router.put("/results/:resultId/viewed", markResultViewed);

export default router;
