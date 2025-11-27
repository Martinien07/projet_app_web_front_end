// routes/inspectionRoutes.js
import express from 'express';
import inspectionController from '../controllers/inspectionController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// CRUD de base
router.get('/',protect, inspectionController.getAll);
router.get('/:id',protect, inspectionController.getById);
router.post('/',protect, inspectionController.create);
router.put('/:id',protect, inspectionController.update);
router.delete('/:id',protect, inspectionController.remove);

export default router;
