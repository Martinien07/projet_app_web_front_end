import { Role } from "../models/relation.js";

// recupérer tous les utilisateurs
//import Role from "../models/Roles.js";
export const getAllRoles = async (req, res) => {

    try {  
        const roles = await Role.findAll();

        res.status(200).json({ data: roles }) 
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// ajouter un utilisateur
export const addRole = async (req, res) => {
    const newRole = req.body;

    try {
        const role = await Role.create(newRole);
        res.status(201).json({ data: role, message: "Role ajouté avec succes" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
// recupérer un role par son id
export const getRoleById = async (req, res) => {
    const { id } = req.params;
    try {
        const role = await Role.findByPk(id);
        res.status(200).json({ data: role })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}


//modifier un role

export const updateRole = async (req, res) => {
    const { id } = req.params;
    const updatedRole = req.body;

    try {
        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({ message: "Role non trouvé" });
        }

        // Champs autorisés à être modifiés
        const allowedFields = ["name", "description"];

        const safeData = Object.keys(updatedRole)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => ({ ...obj, [key]: updatedRole[key] }), {});

        // Si aucun champ valide n'est envoyé
        if (Object.keys(safeData).length === 0) {
            return res.status(400).json({ message: "Aucun champ valide à mettre à jour" });
        }

        await role.update(safeData);

        res.status(200).json({
            data: role,
            message: "Role mis à jour avec succès"
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//supprimer un role
export const deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        const role = await Role.findByPk(id);
        if (role) {
            await role.destroy();
            res.status(200).json({ message: "Role supprime avec succes" });
        } else {
            res.status(404).json({ message: "Role non trouve" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}







