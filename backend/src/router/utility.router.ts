import { Router } from "express";
import { 
    healthCheck,
    getSystemStatus,
    getPublicConfig,
    getSearchSuggestions,
    validateNCOCode,
    getNCOHierarchy
} from "../controller/utility.controller";

const router = Router();

// Public utility routes (no authentication required)
router.get("/health", healthCheck);
router.get("/status", getSystemStatus);
router.get("/config/public", getPublicConfig);
router.get("/suggestions", getSearchSuggestions);
router.get("/validate-nco/:code", validateNCOCode);
router.get("/nco-hierarchy", getNCOHierarchy);

export default router;
