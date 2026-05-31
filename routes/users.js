const express = require("express");
const router = express.Router({mergeParams: true});
const connection = require("../db.js");
const bcrypt = require("bcrypt");
const {v4:uuidv4} = require("uuid");

const userController = require("../controllers/users.js");


router
.route("/registration")
.get(userController.renderRegistration)
.post(userController.registration);

router
.route("/login")
.get(userController.renderLogin)
.post(userController.login);

module.exports = router;