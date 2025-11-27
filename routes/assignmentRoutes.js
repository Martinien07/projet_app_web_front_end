//toutes les routes liees aux utilisateurs
import express from 'express';



import { getAllAssignments, addAssignment, getAssignmentById, updateAssignment, deleteAssignment } from '../controllers/assignmentController.js';
import { validateAssignment, validateAssignmentUpdate } from '../validations/assignmentValidator.js';


import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
//Route pour recuperer tous les assignments
router.get('/',protect, getAllAssignments);

//Route pour ajouter un assignments
router.post('/',protect, validateAssignment, addAssignment);

//Route pour recuperer un assignments par userId
router.get('/:userId',protect, getAssignmentById);
//Route pour modifier un assignments

router.put('/:userId',protect,validateAssignmentUpdate, updateAssignment);


//Route pour supprimer un assignments
router.delete('/:id',protect, deleteAssignment);


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
