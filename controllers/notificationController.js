import { where } from "sequelize";
import { NotificationRecipient, Notification, Assignment, User } from "../models/relation.js";


//Pour créer une notification 

export const createNotification = async (req, res) => {
  try {
    const {
      senderId,
      title,
      message,
      scope,       // "user" | "chantier" | "list" | "global"
      level,       // "all" | "private" | "hprivate"
      target       // userId | chantierId | [ids] | "all"
    } = req.body;

    // --- VALIDATIONS MINIMALES ---
    if (!title || !message || !scope) {
      return res.status(400).json({ message: "title, message et scope sont requis" });
    }

    // Valeur par défaut
    const finalLevel = level || "all";

   
    // 1) CREATION DE LA NOTIFICATION

    const notification = await Notification.create({
      senderId: senderId || null,
      title,
      message,
      scope,
      level: finalLevel,
      target: target || "all",
    });

  
    // 2) DÉTERMINATION DES DESTINATAIRES

    let usersToNotify = [];

    /** ---- SCOPE : user ---- **/
    if (scope === "user") {
      if (!target) {
        return res.status(400).json({ message: "target doit contenir userId pour scope=user" });
      }

      usersToNotify = [target];
    }

    /** ---- SCOPE : chantier ---- **/
    if (scope === "chantier") {
      if (!target) {
        return res.status(400).json({ message: "target doit être chantierId pour scope=chantier" });
      }

      const assignments = await Assignment.findAll({
        where: { chantierId: target }
      });

      usersToNotify = assignments.map(a => a.userId);

      if (usersToNotify.length === 0) {
        return res.status(404).json({
          message: "Aucun utilisateur assigné à ce chantier"
        });
      }
    }

    /** ---- SCOPE : list ---- **/
    if (scope === "list") {
      if (!Array.isArray(target)) {
        return res.status(400).json({ message: "target doit être une liste d'IDs pour scope=list" });
      }
      usersToNotify = target;
    }

    /** ---- SCOPE : global ---- **/
    if (scope === "global") {
      const allUsers = await User.findAll({ attributes: ["id"] });
      usersToNotify = allUsers.map(u => u.id);
    }

    // Retirer doublons si list + chantier overlappent
    usersToNotify = [...new Set(usersToNotify)];


    // 3) CREATION DES ENREGISTREMENTS DANS NotificationRecipients

    const recipientsData = usersToNotify.map((userId) => ({
      notificationId: notification.id,
      recipientId:userId,
      isRead: false,
      readAt: null
    }));

    await NotificationRecipient.bulkCreate(recipientsData);


    // 4) REPONSE


    const inforRecepients= await User.findAll({ where: {id:usersToNotify },
                                              attributes:["id","name","email"]
  })

    return res.status(201).json({
      message: "Notification créée avec succès",
      notification,
      recipients: inforRecepients
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};




//Pour obtenir la listes des notifications en fonction des critères 
export const getNotifications = async (req, res) => {
  try {
    const {
      scope,      // user | chantier | list | global  (OPTIONNEL)
      target,     // userId | chantierId | array | "all" (OPTIONNEL)
      level,      // all | private | hprivate (OPTIONNEL)
      isRead      // true | false (OPTIONNEL)
    } = req.query;

    const userId = req.user.id; // utilisateur connecté

    // ---------------------------
    // 1) Construire la condition de base
    // ---------------------------

    const whereNotif = {};
    const whereRecipient = { userId };

    // ---- Filtre sur le niveau ----
    if (level) {
      whereNotif.level = level;
    }

    // ---- Filtre lu / non lu ----
    if (isRead === "true") whereRecipient.isRead = true;
    if (isRead === "false") whereRecipient.isRead = false;

    // ---------------------------
    // 2) Filtrer par scope + target
    // ---------------------------

    if (scope) {
      whereNotif.scope = scope;

      /** ---------------- SCOPE = user ---------------- */
      if (scope === "user") {
        if (!target) {
          return res.status(400).json({
            message: "target doit être userId pour scope=user"
          });
        }

        whereNotif.target = target;
      }

      /** ---------------- SCOPE = chantier ---------------- */
      if (scope === "chantier") {
        if (!target) {
          return res.status(400).json({
            message: "target doit contenir chantierId pour scope=chantier"
          });
        }

        whereNotif.target = target;
      }

      /** ---------------- SCOPE = list ---------------- */
      if (scope === "list") {
        if (!target) {
          return res.status(400).json({
            message: "target doit être une liste d'IDs"
          });
        }

        // target = "1,5,8" dans Postman ? → convertir automatiquement en tableau
        const listIds = Array.isArray(target)
          ? target
          : String(target).split(",").map(Number);

        whereNotif.target = JSON.stringify(listIds);
      }

      /** ---------------- SCOPE = global ---------------- */
      if (scope === "global") {
        whereNotif.target = "all";
      }
    }

    // ---------------------------
    // 3) Exécution de la requête
    // ---------------------------

    const notifications = await Notification.findAll({
      where: whereNotif,
      include: [
        {
          model: NotificationRecipient,
          as: "NotificationRecipients",
          required: true,
          where: whereRecipient,
          attributes: ["userId", "isRead", "readAt"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      count: notifications.length,
      data: notifications
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};



// supprimé une notification - suppression en cascade

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Notification.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification non trouvée" });
    }

    return res.status(200).json({ message: "Notification supprimée avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};





//marquer comme lu 


export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const recipientId = req.user.id; // user connecté (token)

    // Vérifier que la notification existe dans la table des destinataires
    const record = await NotificationRecipient.findOne({
      where: {
        notificationId,
        recipientId
      }
    });

    if (!record) {
      return res.status(404).json({
        message: "Cette notification n'est pas attribuée à cet utilisateur"
      });
    }

    // Si déjà lue, inutile de réécrire
    if (record.isRead) {
      return res.status(200).json({
        message: "Notification déjà marquée comme lue",
        notificationId,
        recipientId
      });
    }

    // Marquer comme lu
    await record.update({
      isRead: true,
      readAt: new Date()
    });

    return res.status(200).json({
      message: "Notification marquée comme lue",
      notificationId,
      recipientId
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};



export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Recherche de la notification avec ses destinataires
    const notification = await Notification.findOne({
      where: { id },
      include: [
        {
          model: NotificationRecipient,
          as: "NotificationRecipients",
          attributes: ["id", "userId", "isRead", "readAt"]
        }
      ]
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }

    return res.status(200).json({
      message: "Notification récupérée avec succès",
      data: notification
    });

  } catch (error) {
    console.error("Erreur getNotificationById :", error);
    return res.status(500).json({ message: "Erreur serveur", error });
  }
};

















