import User from "./User.js";
import Chantier from "./Chantier.js";
import Role from "./Roles.js";
import Assignment from "./Assignment.js";
import Incident from "./Incident.js";
import Inspection from "./Inspection.js";
import Notification from "./Notification.js";
import NotificationRecipient from "./NotificationRecipient.js";

/*------------------------------------------
  RELATIONS ASSIGNMENT (pivot personnalisé)
------------------------------------------*/

// Assignment appartient à 3 modèles
Assignment.belongsTo(User, { foreignKey: "userId" });
Assignment.belongsTo(Chantier, { foreignKey: "chantierId" });
Assignment.belongsTo(Role, { foreignKey: "roleId" });

// Chaque modèle a plusieurs assignments
User.hasMany(Assignment, { foreignKey: "userId" });
Chantier.hasMany(Assignment, { foreignKey: "chantierId" });
Role.hasMany(Assignment, { foreignKey: "roleId" });

/*------------------------------------------
  INCIDENT
------------------------------------------*/

Incident.belongsTo(Chantier, { foreignKey: "chantierId" });
Incident.belongsTo(User, { foreignKey: "reportedBy", as: "Reporter" });

Chantier.hasMany(Incident, { foreignKey: "chantierId" });
User.hasMany(Incident, { foreignKey: "reportedBy", as: "ReportedIncidents" });

/*------------------------------------------
  INSPECTION
------------------------------------------*/

Inspection.belongsTo(Chantier, { foreignKey: "chantierId" });
Inspection.belongsTo(User, { foreignKey: "inspectorId", as: "Inspector" });

Chantier.hasMany(Inspection, { foreignKey: "chantierId" });
User.hasMany(Inspection, { foreignKey: "inspectorId", as: "Inspections" });

/*------------------------------------------
  NOTIFICATION
------------------------------------------*/

Notification.belongsTo(User, { foreignKey: "senderId", as: "Sender" });
Notification.hasMany(NotificationRecipient, { foreignKey: "notificationId", onDelete: "CASCADE" });

NotificationRecipient.belongsTo(Notification, { foreignKey: "notificationId" });
NotificationRecipient.belongsTo(User, { foreignKey: "userId" });

export {
  User,
  Role,
  Chantier,
  Assignment,
  Incident,
  Inspection,
  Notification,
  NotificationRecipient
};
