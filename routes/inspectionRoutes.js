// routes/inspectionRoutes.js
import express from 'express';
const router = express.Router();
import {
  getAllInspections,
  showAddInspectionForm,
  createInspection,
  getInspectionById,
  showEditInspectionForm,
  updateInspection,
  deleteInspection,
} from '../controllers/inspectionController.js';
import { isAuthenticated } from "../middlewares/authSession.js";


router.get("/list", isAuthenticated, getAllInspections);
router.get("/create_form", isAuthenticated, showAddInspectionForm);
router.post("/create", isAuthenticated, createInspection);
router.get("/details/:id", isAuthenticated, getInspectionById);
router.get("/edit/:id", isAuthenticated, showEditInspectionForm);
router.post("/update/:id", isAuthenticated, updateInspection);
router.get("/delete/:id", isAuthenticated, deleteInspection);

export default router;