import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import  { User } from "../models/relation.js";


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render("auth/auth-login", { error: "Utilisateur non trouvé", title:"Log in Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const isDefault = password === process.env.RESET_DEFAULT_PASSWORD;

    if (!isMatch && !isDefault) {
      return res.render("auth/auth-login", { error: "Mot de passe incorrect",  title:"Log in  Mot de passe incorrect" });
    }

    // Générer token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, access: user.access },
      process.env.JWT_SECRET,
      { expiresIn: "200h" }
    );

    //  Stocker le token dans la session
    req.session.token = token;
    req.session.user = {
      id: user.id,
      email: user.email,
      access: user.access
    };

    //  Mot de passe temporaire → redirection spéciale
    if (isDefault) {
      return res.redirect("/auth/change-password");
    }

    //  Connexion OK → dashboard
    return res.redirect("/");

  } catch (error) {
    return res.render("auth/auth-login", { error: error.message,  title:error.message });
  }
};




// Contrôleur pour le changement de mot de passe

export const changementPassword = async (req, res) => {
  const userId = req.session.user.id;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  try {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    const isDefault = oldPassword === process.env.RESET_DEFAULT_PASSWORD;

    if (!isMatch && !isDefault) {
      return res.status(401).json({ message: "Mot de passe actuel incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    return res.status(200).json({ message: "Mot de passe changé avec succès" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erreur à la déconnexion :", err);
            return res.redirect("/dashboard/index");
        }
        res.clearCookie("connect.sid"); // IMPORTANT : retire le cookie de session
        return res.redirect("/login");
    });
};
