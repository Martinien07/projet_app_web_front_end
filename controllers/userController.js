import User from "../models/User.js";
// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.render("user/list-user", {
            page: "users-list",
            title: "Liste des utilisateurs",
            pageGroup: "Utilisateurs",
            error: req.query.error || null,
            success: req.query.success || null,
            users
        });

    } catch (error) {
        res.status(400).render("error/error-400", {
            page: "error-400",
            title: "Erreur 400",
            error: error.message
        });
    }
};

// Ajouter un utilisateur
export const addUser = async (req, res) => {
    const newUser = req.body;

    try {
        const user = await User.create(newUser);

        return res.redirect("/login?success=Compte+ajouté+avec+succès");



    } catch (error) {
        res.status(400).render("error/error-400", {
            page: "error-400",
            title: "Erreur 400",
            error: error.message
        });
    }
};

// Récupérer un utilisateur// GET /admin/users/:id
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.redirect("/admin/users?error=Utilisateur+introuvable");
    }

    res.render("user/details", {
      user,
      isProfile: false
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};



// GET /profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);

    if (!user) {
      return res.redirect("/login?error=Utilisateur+introuvable");
    }

    res.render("user/details", {
      user,
      isProfile: true,

        title: "Profils utilisateur",
        pageGroup: "Utilisateurs",
        page: "profils",
        error: req.query.error || null,
        success: req.query.success || null,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
};




// Supprimer un utilisateur



export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(id);
    if (!user) {
      return res.redirect("/users/list-user?error=Utilisateur+introuvable");
    }

    await user.destroy();

    return res.redirect("/users/list-user?success=Utilisateur+supprimé+avec+succès");

  } catch (err) {
    console.error(err);
    return res.status(500).send("Erreur serveur");
  }
};




// Affichage du formulaire de création
export const newUserPage = (req, res) => {
  res.render("user/user-form", { user: null,
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

    res.redirect("/users/list-user?success=Utilisateur+créé");
  } catch (err) {
    console.error(err);
    res.redirect("/users/list-user?error=Erreur+création");
  }
};

// Afficher formulaire de modification
export const editUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.redirect("/users?error=Introuvable");

  res.render("user/user-form", { user,
                pageGroup: "Utilisateur",
                title: "Modification utilisateur",
                page: "Update de l'utilisateur ",

  });

  } catch (err) {
    console.log(err);
    res.redirect("/error/error-400");
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

    res.redirect("/users/list-user?success=Modifié");
  } catch (err) {
    console.log(err);
    res.redirect("/users?error=Erreur+modification");
  }
};
