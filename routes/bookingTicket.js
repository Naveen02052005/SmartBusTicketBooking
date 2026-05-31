const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const connection = require("../db.js");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const puppeteer = require("puppeteer");

const bookingTicketController = require("../controllers/bookingTicket.js")


router
.route("/bookingTicket")
.get(isLoggedIn,bookingTicketController.renderTicketForm)
.post(isLoggedIn,bookingTicketController.ticketForm);

router
.route("/payment")
.get(bookingTicketController.renderpayment)
.post(bookingTicketController.payment);

router
.route("/ticket/:ticketNumber")
.get(bookingTicketController.showTicket);


router
.route("/bookingTicket/download/:ticketNumber")
.get(bookingTicketController.downloadTicket);


module.exports = router;