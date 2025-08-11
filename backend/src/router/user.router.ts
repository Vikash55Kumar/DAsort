import { Router } from "express";
import { 
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUserSearchHistory,
    getAllUsers,
    updateUserRole,
    deleteUser,
    changePassword
} from "../controller/user.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);
router.get("/search-history", authenticate, getUserSearchHistory);
router.put("/change-password", authenticate, changePassword);

// Admin routes (require admin role)
router.get("/get-allUsers", getAllUsers);
router.put("/:userId/role", authenticate, requireAdmin, updateUserRole);
router.delete("/:userId", authenticate, requireAdmin, deleteUser);

export default router;

