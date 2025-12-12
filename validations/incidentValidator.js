// validations/incidentValidator.js
import { body } from "express-validator";
import { validationResult } from "express-validator";

export const incidentValidationRules = () => {
    return [
        body("chantierId")
            .notEmpty().withMessage("Le chantier est obligatoire")
            .isInt({ min: 1 }).withMessage("ID de chantier invalide"),

        body("title")
            .notEmpty().withMessage("Le titre est obligatoire")
            .isLength({ min: 5, max: 200 }).withMessage("Le titre doit contenir entre 5 et 200 caractères"),

        body("description")
            .notEmpty().withMessage("La description est obligatoire"),

        body("severity")
            .optional()
            .isIn(["mineur", "modéré", "critique"])
            .withMessage("La gravité n'est pas valide"),

        body("status")
            .optional()
            .isIn(["ouvert", "en_cours", "résolu"])
            .withMessage("Le statut n'est pas valide"),

        body("date")
            .notEmpty().withMessage("La date est obligatoire")
            .isISO8601().withMessage("La date doit être valide"),

        body("photo")
            .optional()
            .isString().withMessage("La photo doit être une URL valide"),
    ];
};

export const validateIncident = (req, res, next) => {
    const errors = validationResult(req);

    // S’il y a des erreurs, on stocke en session pour réafficher dans la vue
    if (!errors.isEmpty()) {

        req.session.incidentErrors = errors.array();
        req.session.incidentOld = req.body;

        // Vérifier si on est en création ou en édition
        if (req.params.id) {
            return res.redirect(`/incidents/edit/${req.params.id}`);
        }

        return res.redirect("/incidents/create_form");
    }

    next();
};