const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get("/", (req, res) => res.render("index", {title: "Welcome to BestGig"}));
