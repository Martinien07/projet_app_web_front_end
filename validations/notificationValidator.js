// validations/notificationValidator.js
import { body, validationResult } from "express-validator";

/* ---------------------------------------------
   RÈGLES DE VALIDATION
---------------------------------------------- */
export const notificationValidationRules = () => {
    return [
        body("title")
            .notEmpty().withMessage("Le titre de la notification est obligatoire")
            .isLength({ min: 3 }).withMessage("Le titre doit contenir au moins 3 caractères"),

        body("message")
            .notEmpty().withMessage("Le message de la notification est obligatoire")
            .isLength({ min: 5 }).withMessage("Le message doit contenir au moins 5 caractères"),

        body("scope")
            .notEmpty().withMessage("Le scope de la notification est obligatoire")
            .isIn(["user", "chantier", "list", "global"])
            .withMessage("Le scope doit être 'user', 'chantier', 'list' ou 'global'"),

        body("level")
            .optional()
            .isIn(["all", "private", "hprivate"])
            .withMessage("Le niveau de la notification n'est pas valide"),

        body("target")
            .custom((value, { req }) => {
                const scope = req.body.scope;

                if (scope === "user" && !value) {
                    throw new Error("Le target doit contenir userId pour scope=user");
                }

                if (scope === "chantier" && !value) {
                    throw new Error("Le target doit contenir chantierId pour scope=chantier");
                }

                if (scope === "list") {
                    if (!value || !Array.isArray(value)) {
                        throw new Error("Le target doit être une liste d'IDs pour scope=list");
                    }
                }

                return true;
            })
    ];
};

/* ---------------------------------------------
   VALIDATEUR
---------------------------------------------- */
export const validateNotification = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Stocker les erreurs et l'ancien formulaire en session
        req.session.notificationErrors = errors.array();
        req.session.notificationOld = req.body;

        // Rediriger vers le formulaire de création ou d'édition
        if (req.params.id) {
            return res.redirect(`/notifications/edit/${req.params.id}`);
        }
        return res.redirect("/notifications/create_form");
    }

    next();
};
