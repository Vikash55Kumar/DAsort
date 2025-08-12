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
import { authenticate } from "../middleware/auth";

const router = Router();

// Protected routes (require authentication)
router.post("/", createDataset);
router.get("/get-allDatasets", authenticate, getAllDatasets);
router.get("/get-datasetId/:id", authenticate, getDatasetById);
router.put("/updateDataset/:id", authenticate, updateDataset);
router.delete("/deleteDataset/:id", authenticate, deleteDataset);

// Data records management
router.post("/:id/records", authenticate, addDataRecords);
router.get("/:id/records", authenticate, getDataRecords);
router.put("/:id/records/:recordId/verify", authenticate, verifyDataRecord);

// Dataset processing
router.post("/:id/process", authenticate, processDataset);

export default router;
