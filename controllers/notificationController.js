import { Notification, NotificationRecipient, Assignment, User, Chantier } from "../models/relation.js";

/* ---------------------------------------------
   FORMULAIRE DE CRÉATION D'UNE NOTIFICATION
---------------------------------------------- */
export const showAddNotificationForm = (req, res) => {

    const errors = req.session.notificationErrors || null;
    const old = req.session.notificationOld || null;

    // Reset pour ne pas persister
    req.session.notificationErrors = null;
    req.session.notificationOld = null;

    res.render("notifications/notification-form", { 
        notification: null,
        pageGroup: "notifications",
        title: "Création d'une notification",
        page: "Ajout d'une notification",
        errors,
        old
    });
};

/* ---------------------------------------------
   CRÉER UNE NOTIFICATION
---------------------------------------------- */
export const addNotification = async (req, res) => {
    try {
        const { senderId, title, message, scope, level, target } = req.body;

        // Validation minimale
        if (!title || !message || !scope) {
            req.session.notificationErrors = [{ msg: "title, message et scope sont requis" }];
            req.session.notificationOld = req.body;
            return res.redirect("/notifications/create_form");
        }

        const finalLevel = level || "all";

        // 1) Création de la notification
        const notification = await Notification.create({
            senderId: senderId || null,
            title,
            message,
            scope,
            level: finalLevel,
            target: target || "all",
        });

        // 2) Déterminer les destinataires
        let usersToNotify = [];

        if (scope === "user") {
            if (!target) {
                req.session.notificationErrors = [{ msg: "target doit contenir userId pour scope=user" }];
                req.session.notificationOld = req.body;
                return res.redirect("/notifications/create_form");
            }
            usersToNotify = [target];
        }

        if (scope === "chantier") {
            if (!target) {
                req.session.notificationErrors = [{ msg: "target doit être chantierId pour scope=chantier" }];
                req.session.notificationOld = req.body;
                return res.redirect("/notifications/create_form");
            }

            const assignments = await Assignment.findAll({ where: { chantierId: target } });
            usersToNotify = assignments.map(a => a.userId);

            if (usersToNotify.length === 0) {
                req.session.notificationErrors = [{ msg: "Aucun utilisateur assigné à ce chantier" }];
                req.session.notificationOld = req.body;
                return res.redirect("/notifications/create_form");
            }
        }

        if (scope === "list") {
            if (!Array.isArray(target)) {
                req.session.notificationErrors = [{ msg: "target doit être une liste d'IDs pour scope=list" }];
                req.session.notificationOld = req.body;
                return res.redirect("/notifications/create_form");
            }
            usersToNotify = target;
        }

        if (scope === "global") {
            const allUsers = await User.findAll({ attributes: ["id"] });
            usersToNotify = allUsers.map(u => u.id);
        }

        usersToNotify = [...new Set(usersToNotify)];

        // 3) Création des enregistrements NotificationRecipients
        const recipientsData = usersToNotify.map(userId => ({
            notificationId: notification.id,
            recipientId: userId,
            isRead: false,
            readAt: null
        }));

        await NotificationRecipient.bulkCreate(recipientsData);

        res.redirect("/notifications/list-notifications?success=Notification+créée");
        
    } catch (error) {
        console.error(error);
        res.redirect("/notifications/list-notifications?error=Erreur+création");
    }
};



/* ---------------------------------------------
   LISTE DE TOUTES LES NOTIFICATIONS DU SYSTÈME
---------------------------------------------- */
export const getAllNotifications = async (req, res) => {
    try {
        // Récupérer toutes les notifications, avec leurs destinataires
        const notifications = await Notification.findAll({
            include: [
                {
                    model: NotificationRecipient,
                    as: "NotificationRecipients",
                    attributes: ["recipientId", "isRead", "readAt"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.render("notifications/list-notification", {
            pageGroup: "notifications",
            title: "Liste des notifications",
            page: "notifications",
            notifications,
            error: req.query.error || null,
            success: req.query.success || null
        });

    } catch (error) {
        console.error(error);
        res.status(500).render("error/error-400", {
            page: "error-400",
            title: "Erreur serveur",
            error: error.message
        });
    }
};












/* ---------------------------------------------
   LISTE DE TOUTES LES NOTIFICATIONS
---------------------------------------------- */
export const getAllNotificationsById = async (req, res) => {
    try {
        const userId = req.user.id;

        // Récupérer notifications assignées à l'utilisateur
        const notifications = await Notification.findAll({
            include: [{
                model: NotificationRecipient,
                as: "NotificationRecipients",
                required: true,
                where: { recipientId: userId },
                attributes: ["userId", "isRead", "readAt"]
            }],
            order: [["createdAt", "DESC"]]
        });

        res.render("notifications/list-notifications", {
            pageGroup: "notifications",
            title: "Liste des notifications",
            page: "Notifications",
            notifications,
            error: req.query.error || null,
            success: req.query.success || null
        });

    } catch (error) {
        console.error(error);
        res.status(500).render("error/error-400", {
            page: "error-400",
            title: "Erreur serveur",
            error: error.message
        });
    }
};

/* ---------------------------------------------
   DÉTAILS D’UNE NOTIFICATION
---------------------------------------------- */
export const getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id, {
            include: [{
                model: NotificationRecipient,
                as: "NotificationRecipients",
                attributes: ["id", "userId", "isRead", "readAt"]
            }]
        });

        if (!notification) {
            return res.redirect("/notifications/list-notifications?error=Notification+introuvable");
        }

        res.render("notifications/details", {
            notification,
            pageGroup: "notifications",
            title: "Détails de la notification",
            page: "Détails",
        });

    } catch (error) {
        console.error(error);
        res.redirect("/notifications/list-notifications?error=Erreur+serveur");
    }
};

/* ---------------------------------------------
   FORMULAIRE DE MODIFICATION D'UNE NOTIFICATION
---------------------------------------------- */
export const showEditNotificationForm = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return res.redirect("/notifications/list-notifications?error=Notification+introuvable");
        }

        res.render("notifications/notification-form", {
            notification,
            pageGroup: "notifications",
            title: "Modification d'une notification",
            page: "Modifier la notification",
            errors: req.session.notificationErrors || null,
            old: req.session.notificationOld || null
        });

        req.session.notificationErrors = null;
        req.session.notificationOld = null;

    } catch (error) {
        console.error(error);
        res.redirect("/notifications/list-notifications?error=Erreur+serveur");
    }
};

/* ---------------------------------------------
   METTRE À JOUR UNE NOTIFICATION
---------------------------------------------- */
export const updateNotification = async (req, res) => {
    try {
        const { title, message, scope, level, target } = req.body;

        await Notification.update(
            { title, message, scope, level, target },
            { where: { id: req.params.id } }
        );

        res.redirect("/notifications/list-notifications?success=Notification+modifiée");

    } catch (error) {
        console.error(error);
        res.redirect("/notifications/list-notifications?error=Erreur+modification");
    }
};

/* ---------------------------------------------
   SUPPRIMER UNE NOTIFICATION
---------------------------------------------- */
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);

        if (!notification) {
            return res.redirect("/notifications/list-notifications?error=Notification+introuvable");
        }

        await notification.destroy();
        res.redirect("/notifications/list-notifications?success=Notification+supprimée");

    } catch (error) {
        console.error(error);
        res.redirect("/notifications/list-notifications?error=Erreur+suppression");
    }
};

/* ---------------------------------------------
   MARQUER UNE NOTIFICATION COMME LUE
---------------------------------------------- */
export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const recipientId = req.user.id;

        const record = await NotificationRecipient.findOne({
            where: { notificationId, recipientId }
        });

        if (!record) {
            return res.redirect("/notifications/list-notifications?error=Notification+non+attribuée");
        }

        if (!record.isRead) {
            await record.update({ isRead: true, readAt: new Date() });
        }

        res.redirect("/notifications/list-notifications?success=Notification+marquée+comme+lue");

    } catch (error) {
        console.error(error);
        res.redirect("/notifications/list-notifications?error=Erreur+serveur");
    }
};
