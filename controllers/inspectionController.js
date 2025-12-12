// controllers/inspectionController.js
import { Inspection, Chantier, User } from "../models/relation.js";
import { Op } from "sequelize";

export const getAllInspections = async (req, res) => {
  try {
    const { page = 1, limit = 10, chantierId, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (chantierId) where.chantierId = chantierId;
    if (status) where.status = status;
    if (search) where.observation = { [Op.like]: `%${search}%` };

    const { count, rows: inspections } = await Inspection.findAndCountAll({
      where,
      include: [
        { association: "Chantier", attributes: ["id", "name", "location"] },
        { association: "Inspector", attributes: ["id", "name", "email"] },
      ],
      order: [["date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });

    res.render("inspections/list-inspection", {
      page: "inspections-list",
      title: "Liste des inspections",
      pageGroup: "inspections",
      error: req.query.error || null,
      success: req.query.success || null,
      inspections,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).render("error/error-400", { error: error.message });
  }
};

export const showAddInspectionForm = async (req, res) => {
  try {
    const chantiers = await Chantier.findAll();
    const users = await User.findAll({ where: { access: { [Op.in]: ["admin", "superviseur", "inspecteur"] } } });

    res.render("inspections/inspection-form", {
      inspection: null,
      chantiers,
      users,
      pageGroup: "inspections",
      title: "Nouvelle inspection",
      page: "Créer une inspection",
      errors: req.session.inspectionErrors || null,
      old: req.session.inspectionOld || null,
    });

    req.session.inspectionErrors = null;
    req.session.inspectionOld = null;
  } catch (err) {
    console.error(err);
    res.redirect("/inspections/list?error=Erreur+chargement");
  }
};

export const createInspection = async (req, res) => {
  try {
    const { chantierId, inspectorId, date, status, observation, recommendations } = req.body;

    if (!chantierId || !inspectorId || !date) {
      req.session.inspectionErrors = [{ msg: "Tous les champs obligatoires doivent être remplis" }];
      req.session.inspectionOld = req.body;
      return res.redirect("/inspections/create_form");
    }

    await Inspection.create({
      chantierId,
      inspectorId,
      date,
      status: status || "en_attente",
      observation,
      recommendations,
    });

    res.redirect("/inspections/list?success=Inspection+créée");
  } catch (error) {
    console.error(error);
    res.redirect("/inspections/list?error=Erreur+création");
  }
};

export const getInspectionById = async (req, res) => {
  try {
    const inspection = await Inspection.findByPk(req.params.id, {
      include: [
        { association: "Chantier", attributes: ["id", "name", "location"] },
        { association: "Inspector", attributes: ["id", "name", "email"] },
      ],
    });

    if (!inspection) return res.redirect("/inspections/list?error=Inspection+introuvable");

    res.render("inspections/details", {
      inspection,
      pageGroup: "inspections",
      title: "Détails de l'inspection",
      page: "Détails",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};

export const showEditInspectionForm = async (req, res) => {
  try {
    const inspection = await Inspection.findByPk(req.params.id);
    if (!inspection) return res.redirect("/inspections/list?error=Inspection+introuvable");

    const chantiers = await Chantier.findAll();
    const users = await User.findAll({ where: { access: { [Op.in]: ["admin", "superviseur", "inspecteur"] } } });

    res.render("inspections/inspection-form", {
      inspection,
      chantiers,
      users,
      pageGroup: "inspections",
      title: "Modifier l'inspection",
      page: "Modifier",
      errors: req.session.inspectionErrors || null,
      old: req.session.inspectionOld || null,
    });

    req.session.inspectionErrors = null;
    req.session.inspectionOld = null;
  } catch (err) {
    console.error(err);
    res.redirect("/inspections/list?error=Erreur");
  }
};

export const updateInspection = async (req, res) => {
  try {
    const inspection = await Inspection.findByPk(req.params.id);
    if (!inspection) return res.redirect("/inspections/list?error=Inspection+introuvable");

    const { chantierId, inspectorId, date, status, observation, recommendations } = req.body;

    await inspection.update({
      chantierId: chantierId || inspection.chantierId,
      inspectorId: inspectorId || inspection.inspectorId,
      date: date || inspection.date,
      status: status || inspection.status,
      observation: observation || inspection.observation,
      recommendations: recommendations || inspection.recommendations,
    });

    res.redirect("/inspections/list?success=Inspection+mise+à+jour");
  } catch (error) {
    console.error(error);
    res.redirect("/inspections/list?error=Erreur+mise+à+jour");
  }
};

export const deleteInspection = async (req, res) => {
  try {
    await Inspection.destroy({ where: { id: req.params.id } });
    res.redirect("/inspections/list?success=Inspection+supprimée");
  } catch (error) {
    console.error(error);
    res.redirect("/inspections/list?error=Erreur+suppression");
  }
};