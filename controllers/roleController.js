import { Role } from "../models/relation.js";

// recupérer tous les utilisateurs
//import Role from "../models/Roles.js";import Role from "../models/Role.js";

// Récupérer tous les rôles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();

        res.render("role/list-role", {
            page: "roles-list",
            title: "Liste des rôles",
            pageGroup: "roles",
            error: req.query.error || null,
            success: req.query.success || null,
            roles
        });

    } catch (error) {
        res.status(400).render("error/error-400", {
            page: "error-400",
            title: "Erreur 400",
            error: error.message
        });
    }
};

// Affichage du formulaire de création
export const showAddRoleForm = (req, res) => {


    const errors = req.session.roleErrors || null;
    const old = req.session.roleOld || null;

    // vider pour éviter qu’elles restent
    req.session.roleErrors = null;
    req.session.roleOld = null;
    res.render("role/role-form", { 
        role: null,
        pageGroup: "roles",
        title: "Création d'un rôle",
        page: "Ajout d'un rôle",
        errors,old
    });
};

// Créer un rôle
export const addRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        await Role.create({ name, description });

        res.redirect("/roles/list-role?success=Rôle+créé");
    } catch (err) {
        console.error(err);
        res.redirect("/roles/list-role?error=Erreur+création");
    }
};

// Récupérer les détails d’un rôle
export const getRoleById = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);

        if (!role) {
            return res.redirect("/roles/list?error=Rôle+introuvable");
        }

        res.render("role/details", {
            role,
            pageGroup: "roles",
            title: "Détails du rôle",
            page: "Détails",
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};

// Afficher le formulaire de modification
export const showEditRoleForm = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);

        if (!role) return res.redirect("/roles/list?error=Rôle+introuvable");

        res.render("role/role-form", {
            role,
            pageGroup: "roles",
            title: "Modification d'un rôle",
            page: "Modifier le rôle",
            error: req.query.error || null,
            success: req.query.success || null,

            errors: req.session.roleErrors || null,
            old: req.session.roleOld || null,
        });

        // Nettoyer la session après l'affichage
        req.session.roleErrors = null;
        req.session.roleOld = null;

    } catch (err) {
        console.error(err);
        res.redirect("/error/error-400");
    }
};


// Mettre à jour un rôle
export const updateRole = async (req, res) => {
    try {
        const { name, description } = req.body;

        await Role.update(
            { name, description },
            { where: { id: req.params.id } }
        );

        res.redirect("/roles/list-role?success=Rôle+modifié");
    } catch (err) {
        console.error(err);
        res.redirect("/roles/list-role?error=Erreur+modification");
    }
};

// Supprimer un rôle
export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return res.redirect("/roles/list-role?error=Rôle+introuvable");
        }

        await role.destroy();
        return res.redirect("/roles/list-role?success=Rôle+supprimé+avec+succès");

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};
