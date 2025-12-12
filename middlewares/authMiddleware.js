import jwt from "jsonwebtoken";

import { User, Role, Assignment, Chantier } from "../models/relation.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token manquant" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Charger entièrement l'utilisateur avec ses relations
        const user = await User.findByPk(decoded.id, {
            include: [
                {
                    model: Role,
                    as: "Roles",
                    attributes: ["id", "name"]
                },
                {
                    model: Assignment,
                    as: "Assignments",
                    include: [
                        {
                            model: Chantier,
                            as: "Chantier",
                            attributes: ["id", "name", "location", "status"]
                        },
                        {
                            model: Role,
                            as: "Role",
                            attributes: ["id", "name"]
                        }
                    ]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Erreur auth middleware :", error);
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};


export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Accès refusé' });
        }

        // If token contains Roles array with objects that have a 'nom' property
        if (Array.isArray(req.user.Roles)) {
            const hasRole = req.user.Roles.some(r => roles.includes(r.nom));
            if (hasRole) return next();
        }

        // If token contains a single role name or roleId
        if (req.user.role && roles.includes(req.user.role)) return next();
        if (req.user.roleId && roles.includes(String(req.user.roleId))) return next();

        return res.status(403).json({ message: 'Accès interdit: rôle insuffisant' });
    };
};