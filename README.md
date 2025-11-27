# Projet Web – Gestion Santé et Sécurité sur les Chantiers

##  Description

Cette application web permet aux entrepreneurs, maîtres d’œuvre et inspecteurs de **gérer la santé et la sécurité sur les chantiers**.  
Elle offre un suivi des incidents, inspections, notifications et affectations des utilisateurs selon leurs rôles sur différents chantiers.

Objectifs :
- Centraliser les informations liées à la sécurité sur un chantier.
- Permettre une affectation dynamique des rôles pour chaque utilisateur.
- Gérer les notifications à différents niveaux (utilisateur individuel, chantier, global).
- Assurer un suivi des incidents et inspections avec traçabilité.

---



---

##  Fonctionnalités principales

### 1 Authentification & Gestion des utilisateurs
- Création, mise à jour et suppression d’utilisateurs.
- Authentification via JWT.
- Gestion des rôles (`admin`, `maitre_oeuvre`, `sous_traitant`, `inspecteur`).
- Mot de passe oublié avec réinitialisation sécurisée.

### 2 Gestion des chantiers
- Création et mise à jour des chantiers.
- Assignation d’utilisateurs avec rôles via la table `Assignment`.
- Gestion des incidents et inspections liés à chaque chantier.

### 3 Notifications
- Envoi de notifications :
  - À un utilisateur précis.
  - À tous les utilisateurs d’un chantier.
  - À tous les utilisateurs (option globale).
- Historique des notifications reçues par chaque utilisateur.

### 4 Sécurité et validation
- Protection des routes sensibles via `authMiddleware`.
- Validation des entrées avec `express-validator`.
- Hashage des mots de passe avec `bcrypt`.
- Contrôle des permissions selon le rôle sur le chantier.

---

##  Base de données (tables principales)

| Table | Principaux champs | Relations |
|-------|-----------------|-----------|
| **User** | id, name, email, password, phone, status, access | `hasMany(Assignment)`, `hasMany(Notification)` |
| **Role** | id, name | `hasMany(Assignment)` |
| **Chantier** | id, name, location, status | `hasMany(Assignment)`, `hasMany(Incident)`, `hasMany(Inspection)`, `hasMany(Notification)` |
| **Assignment** | id, userId, chantierId, roleId, assignedAt | `belongsTo(User, Chantier, Role)` <br> **Contrainte unique** `(userId, chantierId)` |
| **Incident** | id, chantierId, description, severity, date | `belongsTo(Chantier)`, peut être lié à l’utilisateur qui l’a signalé |
| **Inspection** | id, chantierId, inspectorId, date, status | `belongsTo(Chantier)`, `belongsTo(User)` (inspecteur) |
| **Notification** | id, senderId, chantierId, message | `hasMany(NotificationRecipient)` |
| **NotificationRecipient** | id, notificationId, userId | `belongsTo(Notification, User)` |


---

##  Installation et configuration

1. **Cloner le projet :**
```bash
git clone <url_du_projet>
cd projet_app_web

2. Installer les dépendances :
npm install

3.Configurer la base de données et les variables d’environnement dans .env :

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=motdepasse
DB_NAME=chantier_db
JWT_SECRET=cle_super_secrete
PORT=5000


## Structure du projet
projet_app_web/
│
├─ src/
│ ├─ controllers/ # Logique métier (CRUD, auth, notifications...)
│ ├─ middlewares/ # Middlewares (auth, validation...)
│ ├─ models/ # Modèles Sequelize (User, Role, Chantier, Assignment...)
│ ├─ routes/ # Définition des endpoints
│ └─ config/ # Config DB et variables d'environnement
│
├─ package.json
├─ .env # Variables sensibles (JWT_SECRET, DB config)
└─ README.md

---
## Endpoints principaux

Endpoint	Méthode	Description
/api/auth/register	POST	Créer un utilisateur
/api/auth/login	POST	Authentification et récupération du JWT
/api/users	GET	Liste de tous les utilisateurs (admin seulement)
/api/users/:id	GET	Profil d’un utilisateur
/api/users/:id	PUT	Mettre à jour un utilisateur
/api/chantiers	GET	Liste des chantiers
/api/chantiers	POST	Créer un chantier
/api/assignments	POST	Assigner un utilisateur à un chantier avec un rôle
/api/assignments	GET	Lister toutes les affectations
/api/incidents	POST	Déclarer un incident
/api/incidents	GET	Lister les incidents par chantier
/api/inspections	POST	Planifier une inspection
/api/inspections	GET	Lister les inspections par chantier
/api/notifications	POST	Envoyer une notification
/api/notifications	GET	Lister les notifications reçues
---



 Conventions

Les mots de passe sont hashés avec bcrypt.
Les routes protégées nécessitent un JWT valide dans le header Authorization: Bearer <token>.
La table Assignment contient une contrainte unique (userId, chantierId) pour éviter qu’un utilisateur ait plusieurs rôles sur le même chantier.
Chaque incident ou inspection est lié à un chantier et éventuellement à un utilisateur responsab
