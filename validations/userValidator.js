// ecrire toutes les regles de validation pour les utilisateurs ici

import { body } from 'express-validator';
import { validationResult } from 'express-validator';

import { User } from "../models/relation.js";

export const userValidationRules = () => {
    return [
        // Nom
        body('name')
            .notEmpty().withMessage('Le nom est obligatoire')
            .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),

        // Email
        body('email')
            .notEmpty().withMessage("L'email est obligatoire")
            .isEmail().withMessage("L'email n'est pas valide")
            .custom(async (value) => {
                const existingUser = await User.findOne({ where: { email: value } });
                if (existingUser) {
                    throw new Error("Cet email est déjà utilisé");
                }
                return true;
            }),

        // Mot de passe
        body('password')
            .isLength({ min: 12 })
            .withMessage('Le mot de passe doit contenir au moins 12 caractères'),

        // Téléphone
        body('phone')
            .optional()
            .isMobilePhone("any")
            .withMessage('Le numéro de téléphone est invalide'),
    ];
};

export const validateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}



