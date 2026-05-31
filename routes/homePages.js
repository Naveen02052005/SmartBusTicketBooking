const express = require("express");
const router = express.Router();

const interfaceController = require("../controllers/homePages.js")

router
.route("/home")
.get(interfaceController.renderHome);

router
.route("/interface")
.get(interfaceController.renderInterface)

router
.route("/conductor/interface")
.get(interfaceController.renderConductor);

module.exports = router;


