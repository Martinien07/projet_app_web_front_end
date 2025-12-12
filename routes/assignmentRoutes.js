// Toutes les routes liées aux assignments
import express from "express";

import {
    getAllAssignments,
    showAddAssignmentForm,
    addAssignment,
    getAssignmentById,
    showEditAssignmentForm,
    updateAssignment,
    deleteAssignment,
    listChantiersOfConnectedUser
} from "../controllers/assignmentController.js";

import { isAuthenticated } from "../middlewares/authSession.js";

import { assignmentValidationRules, validateAssignment,assignmentValidationRulesUpdate, validateAssignmentUpdate } from "../validations/assignmentValidator.js";

const router = express.Router();

	
// Liste des chantiers d'un utilisateur connecté

router.get("/my-chantiers", isAuthenticated, listChantiersOfConnectedUser);

/* ------------------------------------------
   FORMULAIRE : Ajouter une nouvelle affectation
-------------------------------------------*/
router.get("/create_form", isAuthenticated, showAddAssignmentForm);

/* ------------------------------------------
   ACTION : Enregistrer une nouvelle affectation
-------------------------------------------*/
router.post("/create",
    isAuthenticated,
    assignmentValidationRules(),
    validateAssignment,
    addAssignment
);

/* ------------------------------------------
   Liste de toutes les affectations
-------------------------------------------*/
router.get("/list-assignment", isAuthenticated, getAllAssignments);

/* ------------------------------------------
   Détails d’une affectation
-------------------------------------------*/
router.get("/details/:id", isAuthenticated, getAssignmentById);

/* ------------------------------------------
   FORMULAIRE : Modifier une affectation
-------------------------------------------*/
router.get("/edit/:id", isAuthenticated, showEditAssignmentForm);

/* ------------------------------------------
   ACTION : Modifier l’affectation
-------------------------------------------*/
router.post("/update/:id",
    isAuthenticated,
    assignmentValidationRulesUpdate(),
    validateAssignmentUpdate,
    updateAssignment
);

/* ------------------------------------------
   Supprimer une affectation
-------------------------------------------*/
router.get("/delete/:id", isAuthenticated, deleteAssignment);

export default router;