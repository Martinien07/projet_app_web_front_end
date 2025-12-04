import { Chantier } from "../models/relation.js";



/* ---------------------------------------------
   LISTE DES CHANTIERS
---------------------------------------------- */
export const getAllChantiers = async (req, res) => {
    try {
        const chantiers = await Chantier.findAll();

        res.render("chantiers/list-chantier", {
            page: "chantiers-list",
            title: "Liste des chantiers",
            pageGroup: "chantiers",
            error: req.query.error || null,
            success: req.query.success || null,
            chantiers
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

/* ---------------------------------------------
   FORMULAIRE DE CRÉATION
---------------------------------------------- */
export const showAddChantierForm = (req, res) => {

    const errors = req.session.chantierErrors || null;
    const old = req.session.chantierOld || null;

    // Reset pour ne pas persister
    req.session.chantierErrors = null;
    req.session.chantierOld = null;

    res.render("chantiers/chantier-form", { 
        chantier: null,
        pageGroup: "chantiers",
        title: "Création d'un chantier",
        page: "Ajout d'un chantier",
        errors,
        old
    });
};

/* ---------------------------------------------
   CRÉER UN CHANTIER
---------------------------------------------- */
export const addChantier = async (req, res) => {

    console.log("DEBUG REQ.BODY:", req.body);


    try {
    await Chantier.create({
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status
    });

        res.redirect("/chantiers/list-chantier?success=Chantier+créé");
        
    } catch (err) {
        console.error(err);
        res.redirect("/chantiers/list-chantier?error=Erreur+création");
    }
};







/* ---------------------------------------------
   DÉTAILS D’UN CHANTIER
---------------------------------------------- */
export const getChantierById = async (req, res) => {
    try {
        const chantier = await Chantier.findByPk(req.params.id);

        if (!chantier) {
            return res.redirect("/chantiers/list-chantier?error=Chantier+introuvable");
        }

        res.render("chantiers/details", {
            chantier,
            pageGroup: "chantiers",
            title: "Détails du chantier",
            page: "Détails",
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};

/* ---------------------------------------------
   FORMULAIRE DE MODIFICATION
---------------------------------------------- */
export const showEditChantierForm = async (req, res) => {
    try {
        const chantier = await Chantier.findByPk(req.params.id);

        if (!chantier) {
            return res.redirect("/chantiers/list-chantier?error=Chantier+introuvable");
        }

        res.render("chantiers/chantier-form", {
            chantier,
            pageGroup: "chantiers",
            title: "Modification d'un chantier",
            page: "Modifier le chantier",

            error: req.query.error || null,
            success: req.query.success || null,

            errors: req.session.chantierErrors || null,
            old: req.session.chantierOld || null,
        });

        // Nettoyage
        req.session.chantierErrors = null;
        req.session.chantierOld = null;

    } catch (err) {
        console.error(err);
        res.redirect("/error/error-400");
    }
};

/* ---------------------------------------------
   METTRE À JOUR UN CHANTIER
---------------------------------------------- */
export const updateChantier = async (req, res) => {
    try {
        const { name, location, description, startDate,endDate,status } = req.body;


        await Chantier.update(
            { name, location,description, startDate, endDate, status },
            { where: { id: req.params.id } }
        );

        res.redirect("/chantiers/list-chantier?success=Chantier+modifié");

    } catch (err) {
        console.error(err);
        res.redirect("/chantiers/list-chantier?error=Erreur+modification");
    }
};

/* ---------------------------------------------
   SUPPRIMER UN CHANTIER
---------------------------------------------- */
export const deleteChantier = async (req, res) => {
    try {
        const chantier = await Chantier.findByPk(req.params.id);

        if (!chantier) {
            return res.redirect("/chantiers/list-chantier?error=Chantier+introuvable");
        }

        await chantier.destroy();

        res.redirect("/chantiers/list-chantier?success=Chantier+supprimé");

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};
