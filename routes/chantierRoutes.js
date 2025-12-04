// toutes les routes liées aux chantiers
import express from "express";

import {
    getAllChantiers,
    showAddChantierForm,
    addChantier,
    getChantierById,
    showEditChantierForm,
    updateChantier,
    deleteChantier
} from "../controllers/chantierController.js";

import { isAuthenticated } from "../middlewares/authSession.js";

import { chantierValidationRules, validateChantier } from "../validations/chantierValidator.js";


const router = express.Router();

/* -------------------------------
   FORMULAIRE : Ajouter un chantier
--------------------------------*/
router.get("/create_form", isAuthenticated, showAddChantierForm);

/* -------------------------------
   ACTION : Ajouter un chantier
--------------------------------*/
router.post("/create", 
    isAuthenticated, 
    chantierValidationRules(),
    validateChantier, 
    addChantier
);

/* -------------------------------
   Liste de tous les chantiers
--------------------------------*/
router.get("/list-chantier", isAuthenticated, getAllChantiers);

/* -------------------------------
   Détails d’un chantier
--------------------------------*/
router.get("/details/:id", isAuthenticated, getChantierById);

/* -------------------------------
   FORMULAIRE : Modifier un chantier
--------------------------------*/
router.get("/edit/:id", isAuthenticated, showEditChantierForm);

/* -------------------------------
   ACTION : Modifier un chantier
--------------------------------*/
router.post("/update/:id",
    isAuthenticated,
    chantierValidationRules(),
    validateChantier,
    updateChantier
);
/* -------------------------------
   Supprimer un chantier
--------------------------------*/
router.get("/delete/:id", isAuthenticated, deleteChantier);

export default router;
