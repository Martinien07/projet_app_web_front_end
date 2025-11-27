// ecrire toutes les regles de validation pour les utilisateurs ici

import { body } from 'express-validator';
import { validationResult } from 'express-validator';

export const roleValidationRules = () => {
    return [
        body('description').notEmpty().withMessage('La description est obligatoire'),
        body('name').isIn(['superviseur','ouvrier','responsable','collaborateur', 'employe', 'inspecteur']).withMessage('Le rôle utilisateur n\'est pas valide'),
    ];
}
export const validateRole = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}



