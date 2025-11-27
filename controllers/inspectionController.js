// controllers/inspectionController.js
import Inspection from '../models/Inspection.js';

const inspectionController = {

  // GET /api/inspections
  async getAll(req, res) {
    try {
      const inspections = await Inspection.findAll();
      return res.json({ data: inspections });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // GET /api/inspections/:id
  async getById(req, res) {
    try {
      const inspection = await Inspection.findByPk(req.params.id);

      if (!inspection) {
        return res.status(404).json({ message: 'Inspection non trouvée' });
      }

      return res.json({ data: inspection });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // POST /api/inspections
  async create(req, res) {
    try {
      const {
        chantierId,
        inspectorId,
        date,
        status,
        observation,
        recommendations,
      } = req.body;

      // Vérification minimale
      if (!chantierId || !inspectorId || !date) {
        return res.status(400).json({
          message: "chantierId, inspectorId et date sont obligatoires",
        });
      }

      const inspection = await Inspection.create({
        chantierId,
        inspectorId,
        date,
        status,
        observation,
        recommendations,
      });

      return res.status(201).json({ data: inspection });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la création' });
    }
  },

  // PUT /api/inspections/:id
  async update(req, res) {
    try {
      const {
        chantierId,
        inspectorId,
        date,
        status,
        observation,
        recommendations,
      } = req.body;

      const inspection = await Inspection.findByPk(req.params.id);

      if (!inspection) {
        return res.status(404).json({ message: 'Inspection non trouvée' });
      }

      await inspection.update({
        chantierId,
        inspectorId,
        date,
        status,
        observation,
        recommendations,
      });

      return res.json({ data: inspection });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
  },

  // DELETE /api/inspections/:id
  async remove(req, res) {
    try {
      const inspection = await Inspection.findByPk(req.params.id);

      if (!inspection) {
        return res.status(404).json({ message: 'Inspection non trouvée' });
      }

      await inspection.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  },
};

export default inspectionController;
