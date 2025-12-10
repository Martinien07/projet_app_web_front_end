import express from "express";
import { isAuthenticated } from "../middlewares/authSession.js"
import { error } from "console";
const router = express.Router();

//  Dashboard
router.get("/",isAuthenticated, (req, res) => {
    res.render("dashboard/index", {
        page: "dashboard",
        pageGroup: "dashboard"
    });
});


//  Erreur
router.get("/error/error-403", (req, res) => {
    res.render("error/error-403", {
        page: "error-403",
        pageGroup: "error",
        title: "Ierror-403"

    });
});



router.get("/error/error-400", (req, res) => {
    res.render("error/error-400", {
        page: "error-400",
        pageGroup: "error",
        title: "Ierror-400"

    });
});



router.get("/error/error-404", (req, res) => {
    res.render("error/error-404", {
        page: "error-404",
        pageGroup: "error",
        title: "Ierror-404"

    });
});


router.get("/error/error-500", (req, res) => {
    res.render("error/error-500", {
        page: "error-500",
        pageGroup: "error",
        title: "Ierror-500"

    });
});









//  Authentification
router.get("/register", (req, res) => {
    res.render("auth/auth-register", {
        page: "auth-register",
        pageGroup: "Authentification",
        title: "Inscription utilisateur"

    });
});


router.get("/auth-change-password", (req, res) => {
    res.render("auth/auth-change-password", {
        page: "auth-change-password",
        pageGroup: "Authentification",
        title: "Changement de mot de passe"

    });
});



router.get("/auth-forgot-password", (req, res) => {
    res.render("auth/forgot password", {
        page: "auth-forgot-password",
        pageGroup: "Authentification",
        title: "Mot de passe oublié"

    });
});


router.get("/login", (req, res) => {
    res.render("auth/auth-login", {
        page: "auth-login",
        pageGroup: "Authentification",
        title: "Connexion utilisateur",
        error: req.query.error || null,
        success: req.query.success || null,
    });
});









//  Chantiers
router.get("/chantiers", (req, res) => {
    res.render("chantiers/list_chantier", {
        page: "chantiers_list",
        pageGroup: "chantiers"
    });
});

router.get("/chantiers/add", (req, res) => {
    res.render("chantiers/add_chantier", {
        page: "chantiers_add",
        pageGroup: "chantiers"
    });
});

router.get("/chantiers/assign", (req, res) => {
    res.render("chantiers/assign", {
        page: "chantiers_assign",
        pageGroup: "chantiers"
    });
});


//  Inspections
router.get("/inspections", (req, res) => {
    res.render("inspections/index", {
        page: "inspections_list",
        pageGroup: "inspections"
    });
});

router.get("/inspections/add", (req, res) => {
    res.render("inspections/add", {
        page: "inspections_add",
        pageGroup: "inspections"
    });
});

router.get("/inspections/mine", (req, res) => {
    res.render("inspections/mine", {
        page: "inspections_mine",
        pageGroup: "inspections"
    });
});

router.get("/inspections/sites", (req, res) => {
    res.render("inspections/sites", {
        page: "inspections_sites",
        pageGroup: "inspections"
    });
});

//  Users
router.get("/users", (req, res) => {
    res.render("users/index", {
        page: "users_list",
        pageGroup: "users"
    });
});

router.get("/profile", (req, res) => {
    res.render("users/profile", {
        page: "users_profile",
        pageGroup: "users"
    });
});

//  Roles
router.get("/roles", (req, res) => {
    res.render("roles/index", {
        page: "roles_list",
        pageGroup: "roles"
    });
});

router.get("/roles/add", (req, res) => {
    res.render("roles/add", {
        page: "roles_add",
        pageGroup: "roles"
    });
});

export default router;
