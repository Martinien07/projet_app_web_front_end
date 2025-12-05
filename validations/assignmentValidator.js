import { body, validationResult } from "express-validator";
import { User, Chantier, Role, Assignment } from "../models/relation.js";

/* ---------------------------------------------------------
   RÈGLES DE VALIDATION ASSIGNMENT
--------------------------------------------------------- */
export const assignmentValidationRules = () => {
    return [

        body("userId")
            .notEmpty().withMessage("L'utilisateur est obligatoire")
            .isInt().withMessage("L'ID de l'utilisateur doit être un entier"),

        body("chantierId")
            .notEmpty().withMessage("Le chantier est obligatoire")
            .isInt().withMessage("L'ID du chantier doit être un entier"),

        body("roleId")
            .notEmpty().withMessage("Le rôle est obligatoire")
            .isInt().withMessage("L'ID du rôle doit être un entier"),

        body("assignedAt")
            .optional()
            .isISO8601().withMessage("La date d’affectation doit être valide"),

        body("isActive")
            .optional()
            .isIn(["true", "false", 1, 0])
            .withMessage("Le statut actif n'est pas valide"),

        // Vérifier existence des ID
        body("userId").custom(async value => {
            const user = await User.findByPk(value);
            if (!user) throw new Error("Utilisateur inexistant");
            return true;
        }),

        body("chantierId").custom(async value => {
            const chantier = await Chantier.findByPk(value);
            if (!chantier) throw new Error("Chantier inexistant");
            return true;
        }),

        body("roleId").custom(async value => {
            const role = await Role.findByPk(value);
            if (!role) throw new Error("Rôle inexistant");
            return true;
        }),

        // Vérifier doublon assignment
        body().custom(async reqBody => {
            const { userId, chantierId, roleId } = reqBody;

            const existing = await Assignment.findOne({
                where: { userId, chantierId, roleId }
            });

            if (existing) {
                throw new Error("Cet utilisateur est déjà assigné à ce chantier avec ce rôle");
            }

            return true;
        })
    ];
};


/* ---------------------------------------------------------
   MIDDLEWARE — Gestion erreurs comme chantierValidator
--------------------------------------------------------- */
export const validateAssignment = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        req.session.assignmentErrors = errors.array();
        req.session.assignmentOld = req.body;

        // édition ?
        if (req.params.id) {
            return res.redirect(`/assignments/edit/${req.params.id}`);
        }

        // création
        return res.redirect("/assignments/create_form");
    }

    next();
};




/////////////////////////////////////////////////////////////////////////////////////////////:

///////////////////////////////:: Version pour UPDATE (comme validateChantier)/////////

export const assignmentValidationRulesUpdate = () => {
    return [

        body("userId")
            .optional()
            .isInt().withMessage("L'ID utilisateur doit être un entier")
            .custom(async value => {
                if (!value) return true;
                const user = await User.findByPk(value);
                if (!user) throw new Error("Utilisateur inexistant");
                return true;
            }),

        body("chantierId")
            .optional()
            .isInt().withMessage("L'ID du chantier doit être un entier")
            .custom(async value => {
                if (!value) return true;
                const chantier = await Chantier.findByPk(value);
                if (!chantier) throw new Error("Chantier inexistant");
                return true;
            }),

        body("roleId")
            .optional()
            .isInt().withMessage("L'ID du rôle doit être un entier")
            .custom(async value => {
                if (!value) return true;
                const role = await Role.findByPk(value);
                if (!role) throw new Error("Rôle inexistant");
                return true;
            }),

        body("assignedAt")
            .optional()
            .isISO8601().withMessage("La date doit être valide"),

        body("isActive")
            .optional()
            .isIn(["true", "false", 1, 0]).withMessage("Valeur statut invalide"),

        // Vérification doublon assignment (en tenant compte des valeurs existantes)
        body().custom(async (reqBody, meta) => {
            const id = meta.req.params.id;
            const assignment = await Assignment.findByPk(id);

            if (!assignment) throw new Error("Assignment introuvable");

            const userId = reqBody.userId || assignment.userId;
            const chantierId = reqBody.chantierId || assignment.chantierId;
            const roleId = reqBody.roleId || assignment.roleId;

            const existing = await Assignment.findOne({
                where: { userId, chantierId, roleId }
            });

            if (existing && existing.id !== assignment.id) {
                throw new Error("Un autre assignment possède déjà cette combinaison");
            }

            return true;
        })
    ];
};


export const validateAssignmentUpdate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        req.session.assignmentErrors = errors.array();
        req.session.assignmentOld = req.body;

        return res.redirect(`/assignments/edit/${req.params.id}`);
    }

    next();
};
