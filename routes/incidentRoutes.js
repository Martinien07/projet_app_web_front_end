// routes/incidentRoutes.js
import express  from 'express';
import { body, param, query, validationResult } from 'express-validator';
const router = express.Router();
import {
  getAllIncidents,
  declareIncident,
  getIncidentById,
  updateIncident,
  deleteIncident,
  updateIncidentSeverity,
  updateIncidentStatus,
  markIncidentAsResolved,
  getIncidentStats
} from '../controllers/incidentController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

// Déclarer un incident (Ouvrier/Superviseur)
router.post('/',
    protect,
    //requireRole('ouvrier', 'superviseur'),
    body('chantierId').isInt({ min: 1 }).withMessage('ID de chantier invalide'),
    body('title').notEmpty().withMessage('Le titre est requis').isLength({ min: 5, max: 200 }),
    body('description').notEmpty().withMessage('La description est requise'),
    body('severity').optional().isIn(['mineur', 'modéré', 'critique']).withMessage('Gravité invalide'),
    body('date').optional().isISO8601().withMessage('Date invalide'),
    body('photo').optional().isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await declareIncident(req, res);
    }
);

// Récupérer tous les incidents avec pagination et filtres
router.get('/',
    protect,
    query('page').optional().isInt({ min: 1 }).withMessage('La page doit être un nombre positif'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('La limite doit être entre 1 et 100'),
    query('chantierId').optional().isInt({ min: 1 }).withMessage('ID de chantier invalide'),
    query('severity').optional().isIn(['mineur', 'modéré', 'critique']).withMessage('Gravité invalide'),
    query('status').optional().isIn(['ouvert', 'en_cours', 'résolu']).withMessage('Statut invalide'),
    query('search').optional().trim().isLength({ min: 2 }).withMessage('La recherche doit contenir au moins 2 caractères'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await getAllIncidents(req, res);
    }
);

// Récupérer un incident par son ID
router.get('/:id',
    protect,
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await getIncidentById(req, res);
    }
);

// Classer la gravité d'un incident (Admin/Superviseur)
router.put('/:id/severity',
    protect,
    requireRole('admin', 'superviseur'),
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    body('severity').isIn(['mineur', 'modéré', 'critique']).withMessage('Gravité invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await updateIncidentSeverity(req, res);
    }
);

// Marquer un incident comme résolu (Superviseur)
router.put('/:id/resolve',
    protect,
    requireRole('superviseur'),
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await markIncidentAsResolved(req, res);
    }
);

// Mettre à jour le statut d'un incident (Admin/Superviseur)
router.put('/:id/status',
    protect,
    requireRole('admin', 'superviseur'),
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    body('status').isIn(['ouvert', 'en_cours', 'résolu']).withMessage('Statut invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await updateIncidentStatus(req, res);
    }
);

// Mettre à jour un incident
router.put('/:id',
    protect,
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    body('title').optional().isLength({ min: 5, max: 200 }),
    body('description').optional().notEmpty(),
    body('severity').optional().isIn(['mineur', 'modéré', 'critique']),
    body('date').optional().isISO8601(),
    body('photo').optional().isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await updateIncident(req, res);
    }
);

// Supprimer un incident (Admin seulement)
router.delete('/:id',
    protect,
    requireRole('admin'),
    param('id').isInt({ min: 1 }).withMessage('ID invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await deleteIncident(req, res);
    }
);

// Récupérer les statistiques des incidents
router.get('/stats/overview',
    protect,
    query('chantierId').optional().isInt({ min: 1 }).withMessage('ID de chantier invalide'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await getIncidentStats(req, res);
    }
);

export default router;