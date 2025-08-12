import { Router } from "express";
import { 
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
} from "../controller/admin.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// Dashboard and statistics
router.get("/dashboard", authenticate, getDashboardStats);
router.get("/analytics",authenticate, getAnalytics);

// NCO Code management
router.post("/nco-codes", createNCOCode);
router.put("/nco-codes/:id", updateNCOCode);
router.delete("/nco-codes/:id", deleteNCOCode);
router.post("/nco-codes/bulk-import", bulkImportNCOCodes);

// System configuration
router.get("/system-config", getSystemConfigs);
router.put("/system-config", updateSystemConfig);

// Audit and monitoring
router.get("/audit-logs", authenticate, getAuditLogs);
router.get("/api-requests", authenticate, getAPIRequests);

export default router;
