// validations/chantierValidator.js
import { body } from "express-validator";
import { validationResult } from "express-validator";

export const chantierValidationRules = () => {
    return [
        body("name")
            .notEmpty().withMessage("Le nom du chantier est obligatoire")
            .isLength({ min: 3 }).withMessage("Le nom doit contenir au moins 3 caractères"),

        body("location")
            .notEmpty().withMessage("Le lieu du chantier est obligatoire"),

        body("startDate")
            .notEmpty().withMessage("La date de début est obligatoire")
            .isISO8601().withMessage("La date de début doit être valide"),

        body("endDate")
            .notEmpty().withMessage("La date de fin est obligatoire")
            .isISO8601().withMessage("La date de fin doit être valide")
            .custom((value, { req }) => {
                if (new Date(value) < new Date(req.body.startDate)) {
                    throw new Error("La date de fin doit être postérieure à la date de début");
                }
                return true;
            }),

        body("status")
            .optional()
            .isIn(["en_cours", "termine", "en_pause"])
            .withMessage("Le statut du chantier n'est pas valide"),
    ];
};

export const validateChantier = (req, res, next) => {
    const errors = validationResult(req);

    // S’il y a des erreurs, on stocke en session pour réafficher dans la vue
    if (!errors.isEmpty()) {

        req.session.chantierErrors = errors.array();
        req.session.chantierOld = req.body;

        // Vérifier si on est en création ou en édition
        if (req.params.id) {
            return res.redirect(`/chantiers/edit/${req.params.id}`);
        }

        return res.redirect("/chantiers/create_form");
    }

    next();
};
