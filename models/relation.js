import User from "./User.js";
import Chantier from "./Chantier.js";
import Role from "./Roles.js";
import Assignment from "./Assignment.js";
import Incident from "./Incident.js";
import Inspection from "./Inspection.js";
import Notification from "./Notification.js";
import NotificationRecipient from "./NotificationRecipient.js";

// RELATIONS MANY-TO-MANY VIA ASSIGNMENT


// User <-> Chantier (via Assignment)
User.belongsToMany(Chantier, { through: Assignment, foreignKey: "userId" });
Chantier.belongsToMany(User, { through: Assignment, foreignKey: "chantierId" });

// User <-> Role (via Assignment)
User.belongsToMany(Role, { through: Assignment, foreignKey: "userId" });
Role.belongsToMany(User, { through: Assignment, foreignKey: "roleId" });

// Role <-> Chantier (via Assignment) — optionnel selon besoins
Role.belongsToMany(Chantier, { through: Assignment, foreignKey: "roleId" });
Chantier.belongsToMany(Role, { through: Assignment, foreignKey: "chantierId" });


/*------------------------------------------
 RELATIONS DIRECTES AVEC ASSIGNMENT
------------------------------------------*/

Assignment.belongsTo(User, { foreignKey: "userId" });
Assignment.belongsTo(Chantier, { foreignKey: "chantierId" });
Assignment.belongsTo(Role, { foreignKey: "roleId" });

User.hasMany(Assignment, { foreignKey: "userId" });
Chantier.hasMany(Assignment, { foreignKey: "chantierId" });
Role.hasMany(Assignment, { foreignKey: "roleId" });


/*------------------------------------------
  RELATIONS INCIDENT
------------------------------------------*/

Incident.belongsTo(Chantier, { foreignKey: "chantierId" });
Incident.belongsTo(User, { foreignKey: "reportedBy", as: "Reporter" });

Chantier.hasMany(Incident, { foreignKey: "chantierId" });
User.hasMany(Incident, { foreignKey: "reportedBy", as: "ReportedIncidents" });


/*------------------------------------------
  RELATIONS INSPECTION  ← AJOUTÉES ICI
------------------------------------------*/

// Une inspection appartient à un chantier
Inspection.belongsTo(Chantier, { foreignKey: "chantierId" });

// Une inspection est réalisée par un user (inspecteur)
Inspection.belongsTo(User, { foreignKey: "inspectorId", as: "Inspector" });

// Relation inverse
Chantier.hasMany(Inspection, { foreignKey: "chantierId" });
User.hasMany(Inspection, { foreignKey: "inspectorId", as: "Inspections" });


/*------------------------------------------
  RELATIONS NOTIFICATION (optionnel)
------------------------------------------*/

Notification.belongsTo(User, { foreignKey: "senderId", as: "Sender" });
Notification.hasMany(NotificationRecipient, { foreignKey: "notificationId",
  onDelete: "CASCADE" });

NotificationRecipient.belongsTo(Notification, { foreignKey: "notificationId" });
NotificationRecipient.belongsTo(User, { foreignKey: "userId" });


/*------------------------------------------
 EXPORTS
------------------------------------------*/

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
