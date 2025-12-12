import { Assignment, User, Chantier, Role, Inspection, NotificationRecipient, Notification, Incident } from "../models/relation.js";

export const getDashboard = async (req, res) => {
    try {

        const userId = req.session.user?.id;
        if (!userId) return res.redirect("/login");

        // 1. Nombre total de chantiers
        const totalChantiers = await Chantier.count();

        // 2. Incidents par criticité
        const incidentsCritique = await Incident.count({ where: { severity: "critique" } });
        const incidentsModere = await Incident.count({ where: { severity: "modéré" } });
        const incidentsMineur = await Incident.count({ where: { severity: "mineur" } });

        // 3. Par statut
        const incidentsOuverts = await Incident.count({ where: { status: "ouvert" } });
        const incidentsEnCours = await Incident.count({ where: { status: "en_cours" } });
        const incidentsResolus = await Incident.count({ where: { status: "résolu" } });

        // 4. Inspections
        const totalInspections = await Inspection.count();

        // 5. Derniers incidents
        const lastIncidents = await Incident.findAll({
            limit: 5,
            order: [["date", "DESC"]],
            include: [
                { model: Chantier },
                { model: User, as: "Reporter" }
            ]
        });

        // 6. Assignments actifs
        const activeAssignments = await Assignment.count({ where: { isActive: true } });

        // 7. Notifications
        const lastNotificationsRaw = await NotificationRecipient.findAll({
            where: { recipientId: userId },
            include: [
                {
                    model: Notification,
                    include: [{ model: User, as: "Sender", attributes: ["id", "name"] }]
                }
            ],
            order: [["createdAt", "DESC"]],
            limit: 10
        });

        // Formatter
        const lastNotifications = lastNotificationsRaw.map(item => ({
            id: item.notificationId,
            isRead: item.isRead,
            readAt: item.readAt,
            title: item.Notification.title,
            Sender: item.Notification.Sender
        }));

        const totalIncidents = await Incident.count();

        res.render("dashboard/index", {
            totalChantiers,
            totalInspections,
            totalIncidents,
            incidentsCritique,
            incidentsModere,
            incidentsMineur,
            incidentsOuverts,
            incidentsEnCours,
            incidentsResolus,
            activeAssignments,
            lastIncidents,
            lastNotifications,

            pageGroup: "dashboard",
            title: "dashboard",
            page: "dashboard",
        });

    } catch (error) {
        console.error(error);
        res.redirect("/error/error-500");
    }
};
