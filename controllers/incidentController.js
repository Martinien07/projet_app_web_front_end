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

    // Tous les utilisateurs voient tous les incidents (sans restriction)

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

    res.render("incidents/list-incident", {
      page: "incidents-list",
      title: "Liste des incidents",
      pageGroup: "incidents",
      error: req.query.error || null,
      success: req.query.success || null,
      incidents,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).render("error/error-400", {
      page: "error-400",
      title: "Erreur 400",
      error: error.message
    });
  }
};


// FORMULAIRE DE CRÉATION
export const showAddIncidentForm = (req, res) => {

  const errors = req.session.incidentErrors || null;
  const old = req.session.incidentOld || null;

  // Reset pour ne pas persister
  req.session.incidentErrors = null;
  req.session.incidentOld = null;

  Chantier.findAll().then(chantiers => {
    res.render("incidents/incident-form", { 
      incident: null,
      chantiers,
      pageGroup: "incidents",
      title: "Création d'un incident",
      page: "Ajout d'un incident",
      errors,
      old
    });
  }).catch(err => {
    console.error(err);
    res.redirect("/incidents/list-incident?error=Erreur+chargement");
  });
};


//DECLARE INCIDENT//

export const declareIncident = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.incidentErrors = errors.array();
      req.session.incidentOld = req.body;
      return res.redirect("/incidents/create_form");
    }

    const { chantierId, title, description, severity, date, photo } = req.body;

    const chantier = await Chantier.findByPk(chantierId);
    if (!chantier) return res.redirect("/incidents/create_form?error=Chantier+introuvable");

    /* const assignment = await Assignment.findOne({
      where: { userId: req.session.user.id, chantierId, isActive:1 },
    });

    if (!assignment || !(req.session.user && req.session.user.access === "admin")) {
      return res.redirect("/incidents/create_form?error=Accès+non+autorisé");
    }*/

    const incident = await Incident.create({
      chantierId,
      reportedBy: req.session.user.id,
      title,
      description,
      severity: severity || "mineur",
      status: "ouvert",
      date: date || new Date(),
      photo,
    });

    res.redirect("/incidents/list-incident?success=Incident+créé");
  } catch (error) {
    console.error(error);
    res.redirect("/incidents/list-incident?error=Erreur+création");
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

    if (!incident) return res.redirect("/incidents/list-incident?error=Incident+introuvable");

    // Tous les utilisateurs peuvent voir les détails (sans restriction)

    res.render("incidents/details", {
      incident,
      pageGroup: "incidents",
      title: "Détails de l'incident",
      page: "Détails",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};


// FORMULAIRE DE MODIFICATION
export const showEditIncidentForm = async (req, res) => {
  try {
    const incident = await Incident.findByPk(req.params.id);

    if (!incident) {
      return res.redirect("/incidents/list-incident?error=Incident+introuvable");
    }

    const chantiers = await Chantier.findAll();

    res.render("incidents/incident-form", {
      incident,
      chantiers,
      pageGroup: "incidents",
      title: "Modification d'un incident",
      page: "Modifier l'incident",

      error: req.query.error || null,
      success: req.query.success || null,

      errors: req.session.incidentErrors || null,
      old: req.session.incidentOld || null,
    });

    // Nettoyage
    req.session.incidentErrors = null;
    req.session.incidentOld = null;

  } catch (err) {
    console.error(err);
    res.redirect("/error/error-400");
  }
};


//---------------------- UPDATE INCIDENT ----------------------//

export const updateIncident = async (req, res) => {
  const { id } = req.params;
  const { title, description, severity, date, photo } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.incidentErrors = errors.array();
      req.session.incidentOld = req.body;
      return res.redirect(`/incidents/edit/${id}`);
    }

    const incident = await Incident.findByPk(id);
    if (!incident) return res.redirect("/incidents/list-incident?error=Incident+introuvable");

    if (!(req.session.user && req.session.user.access === "admin")) {
      return res.redirect("/incidents/list-incident?error=Permissions+insuffisantes");
    }

    await incident.update({
      title: title ?? incident.title,
      description: description ?? incident.description,
      severity: severity ?? incident.severity,
      date: date ?? incident.date,
      photo: photo ?? incident.photo,
    });

    res.redirect("/incidents/list-incident?success=Incident+modifié");
  } catch (error) {
    console.error(error);
    res.redirect("/incidents/list-incident?error=Erreur+modification");
  }
};


//---------------------- DELETE INCIDENT ----------------------//

export const deleteIncident = async (req, res) => {
  const { id } = req.params;

  try {
    const incident = await Incident.findByPk(id);
    if (!incident) return res.redirect("/incidents/list-incident?error=Incident+introuvable");

    await Incident.destroy({ where: { id } });

    res.redirect("/incidents/list-incident?success=Incident+supprimé");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};


//---------------------- UPDATE SEVERITY ----------------------//

export const updateIncidentSeverity = async (req, res) => {
  const { id } = req.params;
  const { severity } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.redirect(`/incidents/edit/${id}?error=Validation+échouée`);

    const incident = await Incident.findByPk(id);
    if (!incident) return res.redirect("/incidents/list-incident?error=Incident+introuvable");

    await incident.update({ severity });

    res.redirect("/incidents/list-incident?success=Gravité+mise+à+jour");
  } catch (error) {
    console.error(error);
    res.redirect("/incidents/list-incident?error=Erreur+mise+à+jour");
  }
};


//---------------------- UPDATE STATUS ----------------------//

export const updateIncidentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.redirect(`/incidents/edit/${id}?error=Validation+échouée`);

    const incident = await Incident.findByPk(id);
    if (!incident) return res.redirect("/incidents/list-incident?error=Incident+introuvable");

    await incident.update({ status });

    res.redirect("/incidents/list-incident?success=Statut+mis+à+jour");
  } catch (error) {
    console.error(error);
    res.redirect("/incidents/list-incident?error=Erreur+mise+à+jour");
  }
};


//---------------------- RESOLVE INCIDENT ----------------------//

export const markIncidentAsResolved = async (req, res) => {
  const { id } = req.params;

  try {
    const incident = await Incident.findByPk(id);
    if (!incident) return res.redirect("/incidents/list-incident?error=Incident+introuvable");

    await incident.update({ status: "résolu" });

    res.redirect("/incidents/list-incident?success=Incident+résolu");
  } catch (error) {
    console.error(error);
    res.redirect("/incidents/list-incident?error=Erreur+mise+à+jour");
  }
};


//---------------------- STATS ----------------------//

export const getIncidentStats = async (req, res) => {
  try {
    const { chantierId } = req.query;
    const whereConditions = {};

    if (chantierId) whereConditions.chantierId = chantierId;

    // Tous les utilisateurs voient les stats de tous les incidents (sans restriction)

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

    // Pour l'instant, render une vue simple pour stats, ou intégrer dans dashboard. Ici, on assume render json pour l'instant, ou créer une vue stats si besoin.
    res.render("incidents/stats", { stats }); // À créer si besoin, sinon garder json
    // res.status(200).json({ data: stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};