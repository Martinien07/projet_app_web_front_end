// routes/incidentRoutes.js
import express  from 'express';
const router = express.Router();
import {
  getAllIncidents,
  showAddIncidentForm,
  declareIncident,
  getIncidentById,
  showEditIncidentForm,
  updateIncident,
  deleteIncident,
  updateIncidentSeverity,
  updateIncidentStatus,
  markIncidentAsResolved,
  getIncidentStats
} from '../controllers/incidentController.js';
import { isAuthenticated } from "../middlewares/authSession.js";

import { incidentValidationRules, validateIncident } from "../validations/incidentValidator.js";

// FORMULAIRE : Ajouter un incident
router.get("/create_form", isAuthenticated, showAddIncidentForm);

// ACTION : Ajouter un incident
router.post("/create", 
    isAuthenticated, 
    incidentValidationRules(),
    validateIncident, 
    declareIncident
);

// Liste de tous les incidents
router.get("/list-incident", isAuthenticated, getAllIncidents);

// Détails d’un incident
router.get("/details/:id", isAuthenticated, getIncidentById);

// FORMULAIRE : Modifier un incident
router.get("/edit/:id", isAuthenticated, showEditIncidentForm);

// ACTION : Modifier un incident
router.post("/update/:id",
    isAuthenticated,
    incidentValidationRules(),
    validateIncident,
    updateIncident
);

// Supprimer un incident
router.get("/delete/:id", 
    isAuthenticated, 
    // requireRole('admin'), 
    deleteIncident
);

// Classer la gravité d'un incident (Admin/Superviseur)
router.post('/:id/severity',
    isAuthenticated,
    // requireRole('admin', 'superviseur'),
    incidentValidationRules(), // Adapter si besoin
    validateIncident,
    updateIncidentSeverity
);

// Marquer un incident comme résolu (Superviseur)
router.post('/:id/resolve',
    isAuthenticated,
    // requireRole('superviseur'),
    markIncidentAsResolved
);

// Mettre à jour le statut d'un incident (Admin/Superviseur)
router.post('/:id/status',
    isAuthenticated,
    // requireRole('admin', 'superviseur'),
    incidentValidationRules(), // Adapter si besoin
    validateIncident,
    updateIncidentStatus
);

// Récupérer les statistiques des incidents
router.get('/stats/overview', isAuthenticated, getIncidentStats);

export default router;