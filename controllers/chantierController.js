import { Chantier, Incident } from "../models/relation.js";
import Assignment from "../models/Assignment.js"; 
import { validationResult } from 'express-validator';
import { Op, fn, col } from "sequelize";

// récupérer tous les chantiers avec pagination et filtres
export const getAllChantiers = async (req, res) => {
  try {
    const { page = 1, limit = 10, statut, search } = req.query;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    
    if (statut) {
      whereConditions.statut = statut;
    }
    
    if (search) {
      whereConditions.nom = { [Op.like]: `%${search}%` };
    }

    const { count, rows: chantiers } = await Chantier.findAndCountAll({
      where: whereConditions,
      include: [{
        association: 'Users',
        through: { attributes: [] } // Ne pas inclure les attributs de la table de liaison
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    res.status(200).json({
      data: chantiers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ajouter un chantier
export const addChantier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newChantier = req.body;
    const createdChantier = await Chantier.create({
      ...newChantier,
      statut: 'actif'
    });

    /* Ajouter l'utilisateur créateur comme assigné au chantier via la table Assignments
    if (req.user && req.user.id) {
      await Assignment.create({
        userId: req.user.id,
        chantierId: createdChantier.id,
        roleId: req.user.roleId, // Supposons que le rôle est stocké dans req.user
        assignedAt: new Date(),
        isActive: true
      });
    }*/

    res.status(201).json({ 
      data: createdChantier, 
      message: "Chantier ajouté avec succès" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// récupérer un chantier par son id
export const getChantierById = async (req, res) => {
  const { id } = req.params;
  try {
    const chantier = await Chantier.findByPk(id, {
      include: [{
        association: 'Users',
        through: { attributes: [] }
      }]
    });
    
    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }

    res.status(200).json({ data: chantier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// modifier un chantier
export const updateChantier = async (req, res) => {
  const { id } = req.params;
  const updatedChantier = req.body;
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const chantier = await Chantier.findByPk(id);
    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }

    await Chantier.update(updatedChantier, { where: { id } });
    res.status(200).json({ message: "Chantier modifié avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// supprimer un chantier
export const deleteChantier = async (req, res) => {
  const { id } = req.params;
  try {
    const chantier = await Chantier.findByPk(id);
    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }

    // Supprimer d'abord les assignments liés à ce chantier
    await Assignment.destroy({ where: { chantierId: id } });

    // Puis supprimer le chantier
    await Chantier.destroy({ where: { id } });
    
    res.status(200).json({ message: "Chantier supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assigner un utilisateur à un chantier
export const assignUserToChantier = async (req, res) => {
  const { chantierId, userId } = req.params;
  const { roleId } = req.body; // Rôle spécifique pour cet assignment
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const chantier = await Chantier.findByPk(chantierId);
    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }

    // Vérifier si l'assignation existe déjà et est active
    const existingAssignment = await Assignment.findOne({
      where: { 
        userId, 
        chantierId,
        isActive: true
      }
    });

    if (existingAssignment) {
      return res.status(400).json({ message: "Utilisateur déjà assigné à ce chantier" });
    }

    // Créer l'assignation via la table Assignments
    const assignment = await Assignment.create({
      userId: parseInt(userId),
      chantierId: parseInt(chantierId),
      roleId: parseInt(roleId),
      assignedAt: new Date(),
      isActive: true
    });

    res.status(200).json({ 
      message: "Utilisateur assigné au chantier avec succès",
      data: assignment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retirer un utilisateur d'un chantier (désactiver l'assignation)
export const removeUserFromChantier = async (req, res) => {
  const { chantierId, userId } = req.params;
  
  try {
    const chantier = await Chantier.findByPk(chantierId);
    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }

    // Désactiver l'assignation au lieu de la supprimer
    const assignment = await Assignment.findOne({
      where: { 
        userId: parseInt(userId), 
        chantierId: parseInt(chantierId),
        isActive: true
      }
    });

    if (!assignment) {
      return res.status(404).json({ message: "Utilisateur non assigné à ce chantier" });
    }

    // Désactiver l'assignation
    await assignment.update({ isActive: false });

    res.status(200).json({ 
      message: "Utilisateur retiré du chantier avec succès",
      data: {
        chantierId: parseInt(chantierId),
        userId: parseInt(userId)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les utilisateurs assignés à un chantier avec leurs rôles
export const getUsersByChantier = async (req, res) => {
  const { chantierId } = req.params;
  
  try {
    const assignments = await Assignment.findAll({
      where: { 
        chantierId: parseInt(chantierId),
        isActive: true 
      },
      include: [
        {
          association: 'User',
          attributes: ['id', 'nom', 'email', 'telephone']
        },
        {
          association: 'Role',
          attributes: ['id', 'nom']
        }
      ]
    });
    
    if (!assignments || assignments.length === 0) {
      return res.status(200).json({ data: [], message: "Aucun utilisateur assigné à ce chantier" });
    }

    // Formater la réponse pour inclure les informations utilisateur et rôle
    const usersWithRoles = assignments.map(assignment => ({
      assignmentId: assignment.id,
      user: assignment.User,
      role: assignment.Role,
      assignedAt: assignment.assignedAt
    }));

    res.status(200).json({ data: usersWithRoles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier le rôle d'un utilisateur sur un chantier
export const updateUserRoleOnChantier = async (req, res) => {
  const { chantierId, userId } = req.params;
  const { roleId } = req.body;
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const assignment = await Assignment.findOne({
      where: { 
        userId: parseInt(userId), 
        chantierId: parseInt(chantierId),
        isActive: true
      }
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignation non trouvée" });
    }

    await assignment.update({ roleId: parseInt(roleId) });

    res.status(200).json({ 
      message: "Rôle de l'utilisateur mis à jour avec succès",
      data: assignment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marquer un chantier comme terminé
export const markChantierAsCompleted = async (req, res) => {
  const { id } = req.params;
  
  try {
    const chantier = await Chantier.findByPk(id);

    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }

    // Vérifier s'il y a des incidents non résolus avant de le marquer comme terminé
    const incidentsNonResolus = await Incident.count({
      where: { 
        chantierId: id,
        statut: { [Op.ne]: 'resolu' }
      }
    });

    if (incidentsNonResolus > 0) {
      return res.status(400).json({ 
        message: "Impossible de fermer le chantier. Des incidents ne sont pas résolus."
      });
    }

    await Chantier.update({ 
      statut: 'termine',
      dateFinPrevue: new Date()
    }, { where: { id } });

    // Désactiver toutes les assignations actives pour ce chantier
    await Assignment.update(
      { isActive: false },
      { where: { chantierId: id, isActive: true } }
    );

    res.status(200).json({ message: "Chantier marqué comme terminé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Statistiques d'un chantier
export const getChantierStats = async (req, res) => {
  const { id } = req.params;
  
  try {
    const chantier = await Chantier.findByPk(id, {
      include: [{
        association: 'Users',
        through: { attributes: [] }
      }]
    });

    if (!chantier) {
      return res.status(404).json({ message: "Chantier non trouvé" });
    }

    // Compter les assignments actifs par rôle
    const assignmentsByRole = await Assignment.findAll({
      where: { 
        chantierId: parseInt(id),
        isActive: true 
      },
      include: ['Role'],
      group: ['Role.id', 'Role.nom'],
      attributes: [
        'Role.id',
        'Role.nom',
        [fn('COUNT', col('Assignment.id')), 'count']
      ]
    });

    const stats = {
      general: {
        nom: chantier.nom,
        statut: chantier.statut,
        dateDebut: chantier.dateDebut,
        dateFinPrevue: chantier.dateFinPrevue,
        personnelTotal: chantier.Users.length
      },
      personnelParRole: assignmentsByRole.map(role => ({
        role: role.Role.nom,
        count: role.get('count')
      }))
    };

    res.status(200).json({ data: stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};