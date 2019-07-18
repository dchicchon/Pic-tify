const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get("/", (req, res) => res.render("index", { title: "Welcome to Pic-tify" }));

router.get("/home", ensureAuthenticated, (req, res) => {
    console.log("WE MADE IT TO THE INDEX ROUTE")
    console.log(req.user)
    // The second parameter of res.render is going to be the data we send to that page!
    res.render("home", { title: "Pic-tify", firstname: req.user.first_name, lastname: req.user.last_name, email: req.user.email});
})

router.get("/test", (req, res) => res.render("test", { title: "Test" }));

module.exports = router;
