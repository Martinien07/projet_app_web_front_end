// toutes les routes liées aux rôles
import express from 'express';
import { 
    getAllRoles, 
    showAddRoleForm, 
    addRole, 
    getRoleById, 
    showEditRoleForm, 
    updateRole, 
    deleteRole 
} from '../controllers/roleController.js';
import { roleValidationRules, validateRole } from '../validations/roleValidator.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAuthenticated } from '../middlewares/authSession.js';


const router = express.Router();

// Créer un rôle (afficher le formulaire)
router.get("/create_form", isAuthenticated, showAddRoleForm);

// Créer un rôle (POST)
router.post("/create", isAuthenticated, roleValidationRules(), validateRole, addRole);

// Liste des rôles
router.get("/list-role", isAuthenticated, getAllRoles);

// Détails d’un rôle
router.get("/details/:id", isAuthenticated, getRoleById);

// Modifier un rôle (afficher le formulaire)
router.get("/edit/:id", isAuthenticated, showEditRoleForm);

// Modifier un rôle (POST)
router.post("/update/:id", isAuthenticated, updateRole);

// Supprimer un rôle
router.get("/delete/:id", isAuthenticated, deleteRole);

export default router;
