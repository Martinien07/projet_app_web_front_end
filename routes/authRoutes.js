//toutes les routes liees aux utilisateurs
import express from 'express';
import { changementPassword, login } from '../controllers/authController.js';
import { authValidationRules, passwordValidationRules, validateAuth } from '../validations/authValidator.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAuthenticated } from '../middlewares/authSession.js';
import { logout } from "../controllers/authController.js";





const router = express.Router();
//Route pour la connexion
router.post('/login', authValidationRules(),validateAuth, login);
router.put("/change-password/:userId", protect,passwordValidationRules(),validateAuth, changementPassword);
router.get("/logout", logout);



export default router;

