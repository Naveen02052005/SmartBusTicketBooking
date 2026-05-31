const express = require("express");
const router = express.Router();
const {v4:uuidv4} = require("uuid");
const QRCode = require("qrcode");
const connection = require("../db.js");
const {isLoggedIn} = require("../middlewares/isLoggedIn");

const historyController = require("../controllers/history.js");

router
.route("/interface/history")
.get(isLoggedIn,historyController.renderHistory);


module.exports = router;