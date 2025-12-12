//toutes les routes liees aux utilisateurs
import express from 'express';



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


//Route pour supprimer un assignments
router.delete('/:id',isAuthenticated, deleteAssignment);



export default router;


//exemple pour ajouter assignments utilisation postman json

/*
{
    "userId":1,
    "chantierId":2,
    "roleId":3,
    "assignedAt":"2024-10-01T10:00:00Z",
    "isActive":true
}
*/
