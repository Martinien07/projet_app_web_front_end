//toutes les routes liees aux Role
import express from 'express';
import { getAllRoles, addRole, getRoleById, updateRole, deleteRole } from '../controllers/roleController.js';
import { roleValidationRules, validateRole } from '../validations/roleValidator.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();
//Route pour recuperer tous les roles
router.get('/',protect, getAllRoles);
//Route pour ajouter un role
router.post('/',protect, roleValidationRules(), validateRole, addRole);
//Route pour recuperer un role par son id
router.get('/:id',protect, getRoleById);
//Route pour modifier un role
router.put('/:id',protect, updateRole);
//Route pour supprimer un role
router.delete('/:id',protect, deleteRole);


export default router;
