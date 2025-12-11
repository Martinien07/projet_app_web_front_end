// validations/assignmentValidation.js

import { body, validationResult } from "express-validator";
import { User, Chantier, Role, Assignment } from "../models/relation.js";

export const validateAssignment = [
    // 1) VALIDATIONS DE FORMAT
    body("userId")
        .isInt().withMessage("L'ID de l'utilisateur doit être un entier"),

    body("chantierId")
        .isInt().withMessage("L'ID du chantier doit être un entier"),

    body("roleId")
        .isInt().withMessage("L'ID du rôle doit être un entier"),

    body("assignedAt")
        .optional()
        .isISO8601().withMessage("La date d'affectation doit être une date valide"),

    body("isActive")
        .optional()
        .isBoolean().withMessage("Le statut actif doit être un booléen"),

    // 2) VERIFICATION D'EXISTENCE EN BASE
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { userId, chantierId, roleId } = req.body;

        try {
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: "Utilisateur inexistant." });
            }

            const chantier = await Chantier.findByPk(chantierId);
            if (!chantier) {
                return res.status(404).json({ message: "Chantier inexistant." });
            }

            const role = await Role.findByPk(roleId);
            if (!role) {
                return res.status(404).json({ message: "Rôle inexistant." });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // 3) VERIFIER SI L’AFFECTATION EXISTE DÉJÀ
    async (req, res, next) => {
        const { userId, chantierId, roleId } = req.body;

        try {
            const existingAssignment = await Assignment.findOne({
                where: { userId, chantierId, roleId }
            });

            if (existingAssignment) {
                return res.status(409).json({
                    message: "Cet utilisateur est déjà affecté à ce chantier avec ce rôle."
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];


// Pour les mises à jours 


export const validateAssignmentUpdate = [
    // 1) VALIDATIONS DE FORMAT (seulement si le champ est fourni)
    body("userId")
        .optional()
        .isInt().withMessage("L'ID de l'utilisateur doit être un entier"),

    body("chantierId")
        .optional()
        .isInt().withMessage("L'ID du chantier doit être un entier"),

    body("roleId")
        .optional()
        .isInt().withMessage("L'ID du rôle doit être un entier"),

    body("assignedAt")
        .optional()
        .isISO8601().withMessage("La date d'affectation doit être une date valide"),

    body("isActive")
        .optional()
        .isBoolean().withMessage("Le statut actif doit être un booléen"),

    // 2) VERIFICATION D'EXISTENCE EN BASE
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { userId, chantierId, roleId } = req.body;

        try {
            if (userId) {
                const user = await User.findByPk(userId);
                if (!user) {
                    return res.status(404).json({ message: "Utilisateur inexistant." });
                }
            }

            if (chantierId) {
                const chantier = await Chantier.findByPk(chantierId);
                if (!chantier) {
                    return res.status(404).json({ message: "Chantier inexistant." });
                }
            }

            if (roleId) {
                const role = await Role.findByPk(roleId);
                if (!role) {
                    return res.status(404).json({ message: "Rôle inexistant." });
                }
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // 3) VERIFIER SI L’AFFECTATION MODIFIÉE EXISTE DÉJÀ
    async (req, res, next) => {
        const { userId, chantierId, roleId } = req.body;

        // Si aucun des champs principaux n'est modifié, pas besoin de vérifier les doublons
        if (!userId && !chantierId && !roleId) return next();

        try {
            // On cherche une affectation existante avec la combinaison des valeurs mises à jour
            const existingAssignment = await Assignment.findOne({
                where: {
                    userId: userId || req.assignment.userId,
                    chantierId: chantierId || req.assignment.chantierId,
                    roleId: roleId || req.assignment.roleId
                }
            });

            if (existingAssignment && existingAssignment.id !== req.assignment.id) {
                return res.status(409).json({
                    message: "Une autre affectation existe déjà avec ces valeurs."
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];
