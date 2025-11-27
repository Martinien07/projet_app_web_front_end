import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { resetUserPassword } from "../controllers/adminController.js";

const router = express.Router();

// Route protégée + accès admin
router.put("/reset-password/:userId", protect, resetUserPassword);

export default router;
