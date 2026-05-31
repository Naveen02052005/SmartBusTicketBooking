const express = require("express");
const router = express.Router({mergeParams: true});
const bcrypt = require("bcrypt");

const conductorController = require("../controllers/conductorCredentials.js");


router
.route("/conductor/registration")
.get(conductorController.renderConductorRegistration)
.post(conductorController.conductorRegistration);


router
.route("/conductor/login")
.get(conductorController.renderConductorLogin)
.post(conductorController.conductorLogin);


module.exports = router;