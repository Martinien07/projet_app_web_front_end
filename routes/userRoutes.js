//toutes les routes liees aux utilisateurs
import express from 'express';
import { getAllUsers, addUser, getProfile,createUser,editUser,updateUser, deleteUser,newUserPage, getUserDetails } from '../controllers/userController.js';
import { userValidationRules, validateUser } from '../validations/userValidator.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAuthenticated } from '../middlewares/authSession.js';

const router = express.Router();

//Route pour ajouter un utilisateur
router.post('/add-user', userValidationRules(), validateUser, addUser);




// Créer
router.get("/create_form", isAuthenticated, newUserPage);
router.post("/create", isAuthenticated, createUser);

// Liste
router.get("/list-user", isAuthenticated, getAllUsers);

// Profil connecté
router.get("/profile", isAuthenticated, getProfile);

// Détails d’un utilisateur
router.get("/details/:id", isAuthenticated, getUserDetails);

// Modifier
router.get("/edit/:id", isAuthenticated, editUser);
router.post("/update/:id", isAuthenticated, updateUser);

// Supprimer
router.get("/delete/:id", isAuthenticated, deleteUser);





export default router;
//exemple pour ajouter utilisation postman json
/*
{
    "name":"John Doe",
    "email":",
    "password":"password123",
*/