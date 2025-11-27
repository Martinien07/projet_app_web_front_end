// controllers/incidentController.js
import { Incident, Chantier, User, Assignment } from "../models/relation.js";

import { validationResult } from "express-validator";
import { Op } from "sequelize";


//---------------------- GET ALL INCIDENTS ----------------------//

export const getAllIncidents = async (req, res) => {
  try {
    const { page = 1, limit = 10, chantierId, severity, status, search } = req.query;
    const offset = (page - 1) * limit;

    const whereConditions = {};

    if (chantierId) whereConditions.chantierId = chantierId;
    if (severity) whereConditions.severity = severity;
    if (status) whereConditions.status = status;
    if (search) whereConditions.title = { [Op.like]: `%${search}%` };

    // Restriction si pas admin
    if (!req.user.Roles.some(role => role.name === "admin")) {
      const userAssignments = await Assignment.findAll({
        where: { userId: req.user.id, isActive: true },
        attributes: ["chantierId"],
      });

      const chantierIds = userAssignments.map(a => a.chantierId);
      whereConditions.chantierId = { [Op.in]: chantierIds };
    }

    const { count, rows: incidents } = await Incident.findAndCountAll({
      where: whereConditions,
      include: [
        {
          association: "Chantier",
          attributes: ["id", "name", "location"],
        },
        {
          association: "Reporter",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
    });

    res.status(200).json({
      data: incidents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//DECLARE INCIDENT//

export const declareIncident = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { chantierId, title, description, severity, date, photo } = req.body;

    const chantier = await Chantier.findByPk(chantierId);
    if (!chantier) return res.status(404).json({ message: "Chantier non trouvé" });

    // Vérifier si affecté ou admin
   /* const assignment = await Assignment.findOne({
      where: { userId: req.user.id, chantierId, isActive:1 },
    });

    if (!assignment || !req.user.Roles.some(r => r.name === "admin")) {
      return res.status(403).json({ message: "Vous n'êtes pas assigné à ce chantier" });
    }*/

    const incident = await Incident.create({
      chantierId,
      reportedBy: req.user.id,
      title,
      description,
      severity: severity || "mineur",
      status: "ouvert",
      date: date || new Date(),
      photo,
    });

    res.status(201).json({
      data: incident,
      message: "Incident déclaré avec succès",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//---------------------- GET INCIDENT BY ID ----------------------//

export const getIncidentById = async (req, res) => {
  const { id } = req.params;
  try {
    const incident = await Incident.findByPk(id, {
      include: [
        {
          association: "Chantier",
          attributes: ["id", "name", "location"],
        },
        {
          association: "Reporter",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!incident) return res.status(404).json({ message: "Incident non trouvé" });

    // Vérification permissions
    if (!req.user.Roles.some(r => r.name === "admin")) {
      const assignment = await Assignment.findOne({
        where: {
          userId: req.user.id,
          chantierId: incident.chantierId,
          isActive: true,
        },
      });

      if (!assignment) return res.status(403).json({ message: "Accès non autorisé" });
    }

    res.status(200).json({ data: incident });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//---------------------- UPDATE INCIDENT ----------------------//

export const updateIncident = async (req, res) => {
  const { id } = req.params;
  const { title, description, severity, date, photo } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const incident = await Incident.findByPk(id);
    if (!incident) return res.status(404).json({ message: "Incident non trouvé" });

    const isDeclarant = incident.reportedBy === req.user.id;
    const isAdminOrSupervisor = req.user.Roles.some(
      r => r.name === "admin" || r.name === "superviseur"
    );

    if (!isDeclarant && !isAdminOrSupervisor) {
      return res.status(403).json({ message: "Permissions insuffisantes" });
    }

    await incident.update({
      title: title ?? incident.title,
      description: description ?? incident.description,
      severity: severity ?? incident.severity,
      date: date ?? incident.date,
      photo: photo ?? incident.photo,
    });

    res.status(200).json({
      message: "Incident modifié avec succès",
      data: incident,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//---------------------- DELETE INCIDENT ----------------------//

export const deleteIncident = async (req, res) => {
  const { id } = req.params;

  try {
    const incident = await Incident.findByPk(id);
    if (!incident) return res.status(404).json({ message: "Incident non trouvé" });

    await Incident.destroy({ where: { id } });

    res.status(200).json({ message: "Incident supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//---------------------- UPDATE SEVERITY ----------------------//

export const updateIncidentSeverity = async (req, res) => {
  const { id } = req.params;
  const { severity } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const incident = await Incident.findByPk(id);
    if (!incident) return res.status(404).json({ message: "Incident non trouvé" });

    await incident.update({ severity });

    res.status(200).json({
      message: "Gravité mise à jour",
      data: incident,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//---------------------- UPDATE STATUS ----------------------//

export const updateIncidentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const incident = await Incident.findByPk(id);
    if (!incident) return res.status(404).json({ message: "Incident non trouvé" });

    await incident.update({ status });

    res.status(200).json({
      message: "Statut mis à jour",
      data: incident,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//---------------------- RESOLVE INCIDENT ----------------------//

export const markIncidentAsResolved = async (req, res) => {
  const { id } = req.params;

  try {
    const incident = await Incident.findByPk(id);
    if (!incident) return res.status(404).json({ message: "Incident non trouvé" });

    await incident.update({ status: "résolu" });

    res.status(200).json({
      message: "Incident résolu",
      data: incident,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//---------------------- STATS ----------------------//

export const getIncidentStats = async (req, res) => {
  try {
    const { chantierId } = req.query;
    const whereConditions = {};

    if (chantierId) whereConditions.chantierId = chantierId;

    // Restriction si pas admin
    if (!req.user.Roles.some(role => role.name === "admin")) {
      const userAssignments = await Assignment.findAll({
        where: { userId: req.user.id, isActive: true },
        attributes: ["chantierId"],
      });

      const chantierIds = userAssignments.map(a => a.chantierId);
      whereConditions.chantierId = { [Op.in]: chantierIds };
    }

    const incidents = await Incident.findAll({
      where: whereConditions,
      attributes: ["severity", "status"],
    });

    const stats = {
      total: incidents.length,
      parGravite: {
        mineur: incidents.filter(i => i.severity === "mineur").length,
        modéré: incidents.filter(i => i.severity === "modéré").length,
        critique: incidents.filter(i => i.severity === "critique").length,
      },
      parStatut: {
        ouvert: incidents.filter(i => i.status === "ouvert").length,
        en_cours: incidents.filter(i => i.status === "en_cours").length,
        résolu: incidents.filter(i => i.status === "résolu").length,
      },
      tauxResolution:
        incidents.length > 0
          ? (
              (incidents.filter(i => i.status === "résolu").length / incidents.length) *
              100
            ).toFixed(1)
          : 0,
    };

    res.status(200).json({ data: stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
