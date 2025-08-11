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

const router = Router();

// Dashboard and statistics
router.get("/dashboard", getDashboardStats);
router.get("/analytics", getAnalytics);

// NCO Code management
router.post("/nco-codes", createNCOCode);
router.put("/nco-codes/:id", updateNCOCode);
router.delete("/nco-codes/:id", deleteNCOCode);
router.post("/nco-codes/bulk-import", bulkImportNCOCodes);

// System configuration
router.get("/system-config", getSystemConfigs);
router.put("/system-config", updateSystemConfig);

// Audit and monitoring
router.get("/audit-logs", getAuditLogs);
router.get("/api-requests", getAPIRequests);

export default router;
