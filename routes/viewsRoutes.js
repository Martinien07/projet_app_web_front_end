import express from "express";
const router = express.Router();

//  Dashboard
router.get("/", (req, res) => {
    res.render("dashboard/index", {
        page: "dashboard",
        pageGroup: "dashboard"
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

//  Incidents
router.get("/incidents", (req, res) => {
    res.render("incidents/index", {
        page: "incidents_list",
        pageGroup: "incidents"
    });
});

router.get("/incidents/add", (req, res) => {
    res.render("incidents/add", {
        page: "incidents_add",
        pageGroup: "incidents"
    });
});

router.get("/incidents/mine", (req, res) => {
    res.render("incidents/mine", {
        page: "incidents_mine",
        pageGroup: "incidents"
    });
});

router.get("/incidents/sites", (req, res) => {
    res.render("incidents/sites", {
        page: "incidents_sites",
        pageGroup: "incidents"
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
