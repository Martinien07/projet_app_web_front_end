import User from "../models/User.js";

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {  
        const users = await User.findAll();
        res.render("user/list-user", {
            page: "users-list",
            title: "Liste des utilisateurs",
            pageGroup: "Utilisateurs",
            users
        });
    } catch (error) {
        res.status(400).render("/error/error-400", {
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




// Affichage du formulaire de création
export const newUserPage = (req, res) => {
  res.render("/user-form", { user: null,
                pageGroup: "Utilisateur",
                title: "Création utilisateur",
                page: "Ajout d'un utilisateur ",



  });
};

// Créer utilisateur
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, status, access, password } = req.body;


    await User.create({
      name,
      email,
      phone,
      status,
      access,
      password,
    });

    res.redirect("/users?success=Utilisateur+créé");
  } catch (err) {
    console.error(err);
    res.redirect("/users?error=Erreur+création");
  }
};

// Afficher formulaire de modification
export const editUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.redirect("/users?error=Introuvable");

  res.render("/user-form", { user,
                pageGroup: "Utilisateur",
                title: "Modification utilisateur",
                page: "Update de l'utilisateur ",



  });

  } catch (err) {
    console.log(err);
    res.redirect("//users?error=Erreur");
  }
};

// Mettre à jour utilisateur
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, status, access } = req.body;

    await User.update(
      { name, email, phone, status, access },
      { where: { id: req.params.id } }
    );

    res.redirect("/users?success=Modifié");
  } catch (err) {
    console.log(err);
    res.redirect("/users?error=Erreur+modification");
  }
};
