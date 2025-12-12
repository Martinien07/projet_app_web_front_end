//import { User } from "../models/relation.js";

import  { User, Chantier, Role, Assignment } from "../models/relation.js";


// recupérer tous les assignments
export const getAllAssignments = async (req, res) => {
    try {  
        const assignments = await Assignment.findAll({
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Chantier, attributes: ['id', 'name'] },
                { model: Role, attributes: ['id', 'name'] }
            ]
        });
        res.status(200).json({ data: assignments })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

// ajouter un assignment
export const addAssignment = async (req, res) => {
    const newAssignment = req.body;
    try {
        const assignment = await Assignment.create(newAssignment);
        res.status(201).json({ data: assignment, message: "Assignment ajoute avec succes" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


// recupérer un assignment par son idde l'utilisateur
export const getAssignmentById = async (req, res) => {
    const { userId } = req.params; // on récupère le userId depuis l'URL
    try {
        const assignments = await Assignment.findAll({
            where: { userId },
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Chantier, attributes: ['id', 'name'] },
                { model: Role, attributes: ['id', 'name'] }
            ]
        });

        if (!assignments || assignments.length === 0) {
            return res.status(404).json({ message: "Aucunes affectation trouvée pour cet utilisateur." });
        }

        res.status(200).json({ data: assignments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//modifier un assignment

export const updateAssignment = async (req, res) => {
   const { userId } = req.params;
    const updatedAssignment = req.body;
    try {
        const assignment = await Assignment.findOne({where: { userId }});
        if (assignment) {
            await assignment.update(updatedAssignment);
            res.status(200).json({ data: assignment, message: "Assignment mis a jour avec succes" });
        }
            else {  
            res.status(404).json({ message: "Assignment non trouve" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
// supprimer un assignment
export const deleteAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const assignment = await Assignment.findByPk(id);
        if (assignment) {
            await assignment.destroy();
            res.status(200).json({ message: "Assignment supprime avec succes" });
        }
        else {
            res.status(404).json({ message: "Assignment non trouve" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}




// les chantiers sur lesquels l'utilisateur connecté travaille ou a travaillé
export const listChantiersOfConnectedUser = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/login");
        }

        const userId = req.session.user.id;

        const assignments = await Assignment.findAll({
            where: { userId, isActive: true },
            include: [
                { model: Chantier },
                { model: Role }
            ]
        });

        res.render("chantiers/my_chantiers", {
            
            page: "Mes chantiers",
            title: "Liste de mes chantiers",
            pageGroup: "chantiers",
            error: req.query.error || null,
            success: req.query.success || null,
            assignments

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
