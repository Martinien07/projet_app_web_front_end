//toutes les routes liees aux utilisateurs
import express from 'express';
import { getAllUsers, addUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { userValidationRules, validateUser } from '../validations/userValidator.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

//Route pour ajouter un utilisateur
router.post('/add-user', userValidationRules(), validateUser, addUser);
//Route pour recuperer tous les utilisateurs
router.get('/',protect, getAllUsers);
//Route pour recuperer un utilisateur par son id
router.get('/:id',protect, getUserById);
//Route pour modifier un utilisateur
router.put('/:id',protect, updateUser);
//Route pour supprimer un utilisateur
router.delete('/:id',protect, deleteUser);


export default router;
//exemple pour ajouter utilisation postman json
/*
{
    "name":"John Doe",
    "email":",
    "password":"password123",
*/