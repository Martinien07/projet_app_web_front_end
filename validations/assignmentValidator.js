import { body, validationResult } from "express-validator";
import { User, Chantier, Role, Assignment } from "../models/relation.js";
import { Op } from "sequelize";

/* ============================================================
   VALIDATION → CREATION ASSIGNMENT
   ============================================================ */
export const assignmentValidationRules = () => {
    return [

        body("userId")
            .notEmpty().withMessage("L'utilisateur est obligatoire")
            .isInt().withMessage("L'ID de l'utilisateur doit être un entier")
            .custom(async value => {
                const user = await User.findByPk(value);
                if (!user) throw new Error("Utilisateur inexistant");
                return true;
            }),

        body("chantierId")
            .notEmpty().withMessage("Le chantier est obligatoire")
            .isInt().withMessage("L'ID du chantier doit être un entier")
            .custom(async value => {
                const chantier = await Chantier.findByPk(value);
                if (!chantier) throw new Error("Chantier inexistant");
                return true;
            }),

        body("roleId")
            .notEmpty().withMessage("Le rôle est obligatoire")
            .isInt().withMessage("L'ID du rôle doit être un entier")
            .custom(async value => {
                const role = await Role.findByPk(value);
                if (!role) throw new Error("Rôle inexistant");
                return true;
            }),

        //  RÈGLE MÉTIER : un seul rôle par chantier pour un utilisateur
        body().custom(async body => {
            const { userId, chantierId } = body;

            const existing = await Assignment.findOne({
                where: { userId, chantierId }
            });

            if (existing) {
                throw new Error(
                    "Cet utilisateur possède déjà un rôle sur ce chantier. Il ne peut pas en avoir un second."
                );
            }

            return true;
        })
    ];
};



/* ============================================================
   MIDDLEWARE GESTION DES ERREURS
   ============================================================ */
export const validateAssignment = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.session.assignmentErrors = errors.array();
        req.session.assignmentOld = req.body;

        return res.redirect("/assignments/create_form");
    }

    next();
};





/* ============================================================
   VALIDATION → UPDATE ASSIGNMENT
   ============================================================ */
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

        // ❗ Vérification règle métier en update
        body().custom(async (body, meta) => {
            const { userId, chantierId, roleId } = body;
            const assignmentId = meta.req.params.id;

            const assignment = await Assignment.findByPk(assignmentId);
            if (!assignment) throw new Error("Assignment introuvable");

            const realEmployee = userId || assignment.userId;
            const realChantier = chantierId || assignment.chantierId;

            const conflict = await Assignment.findOne({
                where: {
                    userId: realEmployee,
                    chantierId: realChantier,
                    id: { [Op.ne]: assignmentId }
                }
            });

            if (conflict) {
                throw new Error(
                    "Impossible de modifier : cet utilisateur possède déjà un rôle sur ce chantier."
                );
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






