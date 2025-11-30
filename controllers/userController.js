import User from "../models/User.js";

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {  
        const users = await User.findAll();
        res.render("users/list", {
            page: "users-list",
            users
        });
    } catch (error) {
        res.status(400).render("error/error-400", {
            page: "error-400",
            title: "Erreur 400"
        });
    }
};

// Ajouter un utilisateur
export const addUser = async (req, res) => {
    const newUser = req.body;

    try {
        const user = await User.create(newUser);

        res.render("auth/auth-login", {
        page: "auth-login",
        pageGroup: "Authentification",
        title: "Connexion utilisateur"
        
        });

    } catch (error) {
        res.status(400).render("error/error-400", {
            page: "error-400",
            title: "Erreur 400",
            error: error.message
        });
    }
};

// Récupérer un utilisateur
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);

        res.render("users/details", {
            page: "user-details",
            user
        });

    } catch (error) {
        res.status(404).render("error/error-404", {
            page: "error-404",
            title: "Erreur 404"
        });
    }
};

// Modifier un utilisateur
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).render("error/error-404", {
                page: "error-404",
                title: "Utilisateur non trouvé"
            });
        }

        // Champs autorisés
        const allowedFields = ["name", "email", "phone", "status"];
        const safeData = Object.keys(updatedUser)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => ({ ...obj, [key]: updatedUser[key] }), {});

        await user.update(safeData);

        res.render("users/details", {
            page: "user-details",
            user,
            message: "Utilisateur mis à jour avec succès"
        });

    } catch (error) {
        res.status(400).render("error/error-400", {
            page: "error-400",
            title: "Erreur 400"
        });
    }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.render("users/list", {
                page: "users-list",
                message: "Utilisateur supprimé avec succès"
            });
        } else {
            res.status(404).render("error/error-404", {
                page: "error-404",
                title: "Utilisateur non trouvé"
            });
        }
    } catch (error) {
        res.status(400).render("error/error-400", {
            page: "error-400",
            title: "Erreur 400"
        });
    }
};
