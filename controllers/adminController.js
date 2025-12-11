import bcrypt from "bcrypt";
import User from "../models/User.js";

export const resetUserPassword = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user.access !== 1) {
      return res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs." });
    }

    const { userId } = req.params;

    // Trouver l'utilisateur à réinitialiser
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Hacher le mot de passe par défaut défini dans le .env
    const hashedPassword = await bcrypt.hash(process.env.RESET_DEFAULT_PASSWORD, 10);

    // Mettre à jour l'utilisateur
    await user.update({ password: hashedPassword });

    res.status(200).json({ 
      message: `Mot de passe de ${user.email} réinitialisé avec succès.`,
      resetTo: process.env.RESET_DEFAULT_PASSWORD // juste pour vérification interne, à enlever en prod
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
