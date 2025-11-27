import express from "express";
import {
  createNotification,
  getNotifications,
  deleteNotification,
  markNotificationAsRead, getNotificationById
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Créer une notification
 */
router.post("/",protect, createNotification);

/**
 * Récupérer les notifications avec filtres
 * Ex : GET /api/notification?target=18&scope=user&level=all&isRead=false
 */
router.get("/",protect, getNotifications);


router.get("/:id",protect, getNotificationById);


/**
 * Supprimer une notification
 */
router.delete("/:id",protect, deleteNotification);

/**
 * Marquer une notification comme lue
 */
router.put("/read/:notificationId",protect, markNotificationAsRead);

export default router;
