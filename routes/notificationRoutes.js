// toutes les routes liées aux notifications
import express from "express";

import {
    addNotification,
    getAllNotifications,
    getNotificationDetails,
    showAddNotificationForm,
    showEditNotificationForm,
    updateNotification,
    deleteNotification,
    markNotificationAsRead,
    getUserChantierNotifications,
    getAllNotificationsById
    
} from "../controllers/notificationController.js";

import { isAuthenticated } from "../middlewares/authSession.js";
import { notificationValidationRules, validateNotification } from "../validations/notificationValidator.js";

const router = express.Router();



/* -------------------------------
   Liste de toutes les notifications
--------------------------------*/
router.get("/mine", isAuthenticated, getAllNotificationsById);


router.get("/list-notifications", isAuthenticated, getAllNotifications);

router.get("/sites", isAuthenticated, getUserChantierNotifications);

/* -------------------------------
   FORMULAIRE : Ajouter une notification
--------------------------------*/
router.get("/create_form", isAuthenticated, showAddNotificationForm);

/* -------------------------------
   ACTION : Ajouter une notification
--------------------------------*/
router.post("/create", 
    isAuthenticated, 
    notificationValidationRules(),
    validateNotification,
    addNotification
);



// Route pour afficher les détails d’une notification
router.get("/:id", isAuthenticated, getNotificationDetails);

/* -------------------------------
   Détails d’une notification
--------------------------------*/
router.get("/details/:id", isAuthenticated, getNotificationDetails);

/* -------------------------------
   FORMULAIRE : Modifier une notification
--------------------------------*/
router.get("/edit/:id", isAuthenticated, showEditNotificationForm);

/* -------------------------------
   ACTION : Modifier une notification
--------------------------------*/
router.post("/update/:id",
    isAuthenticated,
    notificationValidationRules(),
    validateNotification,
    updateNotification
);

/* -------------------------------
   Supprimer une notification
--------------------------------*/
router.get("/delete/:id", isAuthenticated, deleteNotification);

/* -------------------------------
   Marquer une notification comme lue
--------------------------------*/
router.get("/read/:id", isAuthenticated, markNotificationAsRead);

export default router;
