const express = require("express");
const router = express.Router();
const {isConductorLogged} = require("../middlewares/isLoggedIn")

const conductorActive = require("../controllers/conductor.js");

router
.route("/conductor/active")
.get(isConductorLogged,conductorActive.renderConductorActive);



router
.route("/conductor/scan-ticket")
.post(isConductorLogged,conductorActive.scanTicket);

router
.route("/conductor/stats")
.get(isConductorLogged,conductorActive.journeyDetails);
module.exports = router;