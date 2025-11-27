//import { User } from "../models/relation.js";

// recupérer tous les utilisateurs
import User from "../models/User.js";
export const getAllUsers = async (req, res) => {

    try {  
        const users = await User.findAll();

        res.status(200).json({ data: users }) 
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}
// ajouter un utilisateur
export const addUser = async (req, res) => {
    const newUser = req.body;

    try {
        const user = await User.create(newUser);
        res.status(201).json({ data: user, message: "Utilisateur ajoute avec succes" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
// recupérer un utilisateur par son id
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        res.status(200).json({ data: user })
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
}


//modifier un utilisateur
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Champs autorisés
        const allowedFields = ["name", "email", "phone", "status"];
        const safeData = Object.keys(updatedUser)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => ({ ...obj, [key]: updatedUser[key] }), {});

        // Mettre à jour
        await user.update(safeData);

        res.status(200).json({ data: user, message: "Utilisateur mis à jour avec succès" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//supprimer un utilisateur
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: "Utilisateur supprime avec succes" });
        } else {
            res.status(404).json({ message: "Utilisateur non trouve" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}







