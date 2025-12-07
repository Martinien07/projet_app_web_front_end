import { Assignment, User, Chantier, Role } from "../models/relation.js";

/* =============================================================
   LISTE DES ASSIGNMENTS
   ============================================================= */
export const getAllAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.findAll({
            include: [User, Chantier, Role]
        });

        res.render("assignments/list-assignment", {
            page: "assignments-list",
            title: "Liste des assignments",
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


/* =============================================================
    FORMULAIRE DE CRÉATION
   ============================================================= */
export const showAddAssignmentForm = async (req, res) => {
    const errors = req.session.assignmentErrors || null;
    const old = req.session.assignmentOld || null;

    req.session.assignmentErrors = null;
    req.session.assignmentOld = null;

    try {
        //  CHARGEMENT DES LISTES
        const users = await User.findAll();
        const chantiers = await Chantier.findAll();
        const roles = await Role.findAll();

        res.render("assignments/assignment-form", { 
            assignment: null,
            pageGroup: "chantiers",
            title: "Création d'un assignment",
            page: "Ajout d'un assignment",

            errors,
            old,

            users,
            chantiers,
            roles
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};


/* =============================================================
   CRÉER UN ASSIGNMENT
   ============================================================= */
export const addAssignment = async (req, res) => {

    console.log("DEBUG REQ.BODY:", req.body);

    try {
        let isActive;

        if (Array.isArray(req.body.isActive) && req.body.isActive.includes("1")) {
            isActive = "1";   // coché
        } else {
            isActive = "0";   // décoché
        }




        await Assignment.create({
            userId: req.body.userId,
            chantierId: req.body.chantierId,    
            roleId: req.body.roleId,
            assignedAt: req.body.assignedAt,
            isActive: isActive,
       

        });

        res.redirect("/assignments/list-assignment?success=Assignment+créé");

    } catch (err) {
        console.error(err);

        req.session.assignmentErrors = ["Erreur lors de la création"];
        req.session.assignmentOld = req.body;

        res.redirect("/assignments/create_form");
    }
};


/* =============================================================
   DÉTAILS D’UN ASSIGNMENT
   ============================================================= */
export const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id, {
            include: [User, Chantier, Role]
        });

        if (!assignment) {
            return res.redirect("/assignments/list-assignment?error=Assignment+introuvable");
        }

        res.render("assignments/details", {
            assignment,
            pageGroup: "chantiers",
            title: "Détails de l'assignment",
            page: "Détails",
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};


/* =============================================================
   FORMULAIRE DE MODIFICATION
   ============================================================= */
export const showEditAssignmentForm = async (req, res) => {


    try {
        const assignment = await Assignment.findByPk(req.params.id);

        if (!assignment) {
            return res.redirect("/assignments/list-assignment?error=Assignment+introuvable");
        }

        //  CHARGEMENT DES LISTES
        const users = await User.findAll();
        const chantiers = await Chantier.findAll();
        const roles = await Role.findAll();

        res.render("assignments/assignment-form", {
            assignment,

            pageGroup: "chantiers",
            title: "Modification d'un assignment",
            page: "Modifier l'assignment",

            errors: req.session.assignmentErrors || null,
            old: req.session.assignmentOld || null,

            users,
            chantiers,
            roles
        });

        req.session.assignmentErrors = null;
        req.session.assignmentOld = null;

    } catch (err) {
        console.error(err);
        res.redirect("/assignments/list-assignment?error=Erreur+chargement");
    }
};


/* =============================================================
   METTRE À JOUR UN ASSIGNMENT
   ============================================================= */
export const updateAssignment = async (req, res) => {

    console.log("DEBUG REQ.BODY:", req.body);
    try {

        let isActive;

        if (Array.isArray(req.body.isActive) && req.body.isActive.includes("1")) {
            isActive = "1";   // coché
        } else {
            isActive = "0";   // décoché
        }



        await Assignment.update(
            {
            userId: req.body.userId,
            chantierId: req.body.chantierId,    
            roleId: req.body.roleId,
            assignedAt: req.body.assignedAt,
            isActive: isActive,
            
            },
            { where: { id: req.params.id } }
        );

        res.redirect("/assignments/list-assignment?success=Assignment+modifié");

    } catch (err) {
        console.error(err);

        req.session.assignmentErrors = ["Erreur lors de la modification"];
        req.session.assignmentOld = req.body;

        res.redirect(`/assignments/${req.params.id}/edit`);
    }
};


/* =============================================================
   SUPPRIMER UN ASSIGNMENT
   ============================================================= */
export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);

        if (!assignment) {
            return res.redirect("/assignments/list-assignment?error=Assignment+introuvable");
        }

        await assignment.destroy();

        res.redirect("/assignments/list-assignment?success=Assignment+supprimé");

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};
