import express from "express";
import {
  createNotification,
  getNotifications,
  deleteNotification,
  markNotificationAsRead,
  getNotificationById
} from "../controllers/notification.controller.js";

const router = express.Router();

// créer une notification
router.post("/create", createNotification);

// lister les notifications de l'utilisateur connecté
router.get("/", getNotifications);

// récupérer une notification par id
router.get("/:id", getNotificationById);

// marquer comme lue
router.patch("/:notificationId/read", markNotificationAsRead);

// supprimer une notification
router.delete("/:id", deleteNotification);

export default router;
gi