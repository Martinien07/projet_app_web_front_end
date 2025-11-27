// routes/chantierRoutes.js
import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
const router = express.Router();
import * as chantierController from '../controllers/chantierController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

// Creer un nouveau chantier (Admin/Superviseur)
router.post('/',
    protect,
    //requireRole('admin', 'superviseur'),
    body('name').notEmpty().withMessage('Le nom est requis').isLength({ min: 3, max: 150 }),
    body('location').notEmpty().withMessage('L\'adresse est requise'),
    body('description').optional().trim(),
    body('startDate').optional().isISO8601().withMessage('La date de début est invalide'),
    body('endDate').optional().isISO8601().withMessage('La date de fin prévue est invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.addChantier(req, res);
    }
);

// Lister tous les chantiers avec pagination et filtres
router.get('/',
    protect,
    query('page').optional().isInt({ min: 1 }).withMessage('La page doit être un nombre positif'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('La limite doit être entre 1 et 100'),
    query('statut').optional().isIn(['en_cours', 'termine', 'en_pause']).withMessage('Statut invalide'),
    query('search').optional().trim().isLength({ min: 2 }).withMessage('La recherche doit contenir au moins 2 caractères'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.getAllChantiers(req, res);
    }
);

// Recuperer un chantier par ID
router.get('/:id',
    protect,
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.getChantierById(req, res);
    }
);

// Assigner un utilisateur à un chantier (Admin seulement)
router.post('/:chantierId/assign-user/:userId',
    protect,
    requireRole('admin'),
    param('chantierId').isInt({ min: 1 }).withMessage('ID de chantier invalide'),
    param('userId').isInt({ min: 1 }).withMessage('ID d\'utilisateur invalide'),
    body('roleId').isInt({ min: 1 }).withMessage('Le rôle ID est requis'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.assignUserToChantier(req, res);
    }
);

// Modifier le rôle d'un utilisateur sur un chantier (Admin seulement)
router.put('/:chantierId/users/:userId/role',
    protect,
    requireRole('admin'),
    param('chantierId').isInt({ min: 1 }).withMessage('ID de chantier invalide'),
    param('userId').isInt({ min: 1 }).withMessage('ID d\'utilisateur invalide'),
    body('roleId').isInt({ min: 1 }).withMessage('Le rôle ID est requis'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.updateUserRoleOnChantier(req, res);
    }
);

// Retirer un utilisateur d'un chantier (Admin seulement)
router.delete('/:chantierId/remove-user/:userId',
    protect,
    requireRole('admin'),
    param('chantierId').isInt({ min: 1 }).withMessage('ID de chantier invalide'),
    param('userId').isInt({ min: 1 }).withMessage('ID d\'utilisateur invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.removeUserFromChantier(req, res);
    }
);

// Mettre à jour un chantier (Admin/Superviseur)
router.put('/:id',
    protect,
    //requireRole('admin', 'superviseur'),
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    body('name').optional().trim().isLength({ min: 3, max: 150 }),
    body('location').optional().trim().isLength({ min: 5 }),
    body('description').optional().trim(),
    body('endDate').optional().isISO8601().withMessage('La date de fin prévue est invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.updateChantier(req, res);
    }
);

// Supprimer un chantier (Admin seulement)
router.delete('/:id',
    protect,
    requireRole('admin'),
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.deleteChantier(req, res);
    }
);

// Récupérer tous les utilisateurs assignés à un chantier
router.get('/:chantierId/users',
    protect,
    param('chantierId').isInt({ min: 1 }).withMessage('ID de chantier invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.getUsersByChantier(req, res);
    }
);

// Marquer un chantier comme terminé (Admin seulement)
router.put('/:id/close',
    protect,
    requireRole('admin'),
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.markChantierAsCompleted(req, res);
    }
);

// Récupérer les statistiques d'un chantier (Admin/Superviseur)
router.get('/:id/stats',
    protect,
    requireRole('admin', 'superviseur'),
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await chantierController.getChantierStats(req, res);
    }
);

export default router;