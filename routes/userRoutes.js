//toutes les routes liees aux utilisateurs
import express from 'express';
import { getAllUsers, addUser, getUserById,createUser,editUser,updateUser, deleteUser,newUserPage } from '../controllers/userController.js';
import { userValidationRules, validateUser } from '../validations/userValidator.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAuthenticated } from '../middlewares/authSession.js';

const router = express.Router();

//Route pour ajouter un utilisateur
router.post('/add-user', userValidationRules(), validateUser, addUser);
//Route pour recuperer tous les utilisateurs
router.get('/list-user',isAuthenticated, getAllUsers);
//Route pour recuperer un utilisateur par son id
router.get('/:id',isAuthenticated, getUserById);
//Route pour modifier un utilisateur
router.put('/:id',isAuthenticated, updateUser);
//Route pour supprimer un utilisateur
router.delete('/:id',isAuthenticated, deleteUser);

router.get("/create",isAuthenticated, newUserPage);
router.post("/create",isAuthenticated, createUser);

router.get("/edit/:id",isAuthenticated, editUser);
router.post("/update/:id",isAuthenticated, updateUser);




export default router;
//exemple pour ajouter utilisation postman json
/*
{
    "name":"John Doe",
    "email":",
    "password":"password123",
*/