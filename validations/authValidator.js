// ecrire toutes les regles de validation pour les authentification ici

import { body } from 'express-validator';
import { validationResult } from 'express-validator';

export const authValidationRules = () => {
    return [
        body('email').isEmail().withMessage("L'email n'est pas valide"),
    ];
}
export const validateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


export const passwordValidationRules = () => {
    return [
        body('password').isLength({ min: 12 }).withMessage('Le mot de passe doit contenir au moins 12 caractères'),
    ];
}


export const validateAuth = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
