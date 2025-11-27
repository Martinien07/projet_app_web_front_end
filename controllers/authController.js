import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import  { User } from "../models/relation.js";


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    // Cas spécial : mot de passe temporaire de reset
    const isDefault = password === process.env.RESET_DEFAULT_PASSWORD;

    if (!isMatch && !isDefault) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Crée le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, access: user.access },
      process.env.JWT_SECRET,
      { expiresIn: "200h" }
    );

    // Si le mot de passe correspond au reset default
    if (isDefault) {
      return res.status(200).json({
        message: "Connexion temporaire : vous devez changer votre mot de passe.",
        forcePasswordChange: true, //Indique qu'un changement de mot de passe est requis au niveau frontend
        token,
      });
    }

    // Sinon connexion normale
    return res.status(200).json({
      message: "Connexion réussie.",
      forcePasswordChange: false,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Contrôleur pour le changement de mot de passe

export const changementPassword=async(req,res)=>{
  
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });


    try {
      isMatch= await bcrypt.compare(oldPassword, req.user.password);

      isDefault=oldPassword===process.env.RESET_DEFAULT_PASSWORD;

      if (!isMatch && !isDefault) {
        return res.status(401).json({ message: "Mot de passe actuel incorrect" });
      }

      const hashedPassword= await bcrypt.hash(newPassword,10);
      await user.update({password:hashedPassword});
      res.status(200).json({message:"Mot de passe changé avec succès"});


    } catch (error) {
      res.status(500).json({ message: error.message });
            
    }

}
