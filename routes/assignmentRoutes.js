// Toutes les routes liées aux assignments
import express from "express";

import {
    getAllAssignments,
    showAddAssignmentForm,
    addAssignment,
    getAssignmentById,
    showEditAssignmentForm,
    updateAssignment,
    deleteAssignment
} from "../controllers/assignmentController.js";

import { isAuthenticated } from "../middlewares/authSession.js";

<<<<<<< HEAD
import { assignmentValidationRules, validateAssignment,assignmentValidationRulesUpdate, validateAssignmentUpdate } from "../validations/assignmentValidator.js";

const router = express.Router();

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
=======
import { getAllAssignments, addAssignment, getAssignmentById, updateAssignment, deleteAssignment, listChantiersOfConnectedUser } from '../controllers/assignmentController.js';
import { validateAssignment, validateAssignmentUpdate } from '../validations/assignmentValidator.js';
import { isAuthenticated } from "../middlewares/authSession.js";

const router = express.Router();
//Route pour recuperer tous les assignments
router.get('/',isAuthenticated, getAllAssignments);

//Route pour ajouter un assignments
router.post('/',isAuthenticated, validateAssignment, addAssignment);


// Liste des chantiers d'un utilisateur connecté

router.get("/my-chantiers", isAuthenticated, listChantiersOfConnectedUser);


//Route pour recuperer un assignments par userId
router.get('/:userId',isAuthenticated, getAssignmentById);
//Route pour modifier un assignments

router.put('/:userId',isAuthenticated,validateAssignmentUpdate, updateAssignment);
>>>>>>> origin/notifications

/* ------------------------------------------
   Détails d’une affectation
-------------------------------------------*/
router.get("/details/:id", isAuthenticated, getAssignmentById);

<<<<<<< HEAD
/* ------------------------------------------
   FORMULAIRE : Modifier une affectation
-------------------------------------------*/
router.get("/edit/:id", isAuthenticated, showEditAssignmentForm);
=======
//Route pour supprimer un assignments
router.delete('/:id',isAuthenticated, deleteAssignment);

>>>>>>> origin/notifications

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
