import { Router } from "express";
import { 
    createDataset,
    getAllDatasets,
    getDatasetById,
    updateDataset,
    deleteDataset,
    addDataRecords,
    getDataRecords,
    verifyDataRecord,
    processDataset
} from "../controller/dataset.controller";

const router = Router();

// Protected routes (require authentication)
router.post("/", createDataset);
router.get("/", getAllDatasets);
router.get("/:id", getDatasetById);
router.put("/:id", updateDataset);
router.delete("/:id", deleteDataset);

// Data records management
router.post("/:id/records", addDataRecords);
router.get("/:id/records", getDataRecords);
router.put("/:id/records/:recordId/verify", verifyDataRecord);

// Dataset processing
router.post("/:id/process", processDataset);

export default router;
