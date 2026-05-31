const express = require("express");
const router = express.Router();
const {v4:uuidv4} = require("uuid");
const QRCode = require("qrcode");
const connection = require("../db.js");
const {isLoggedIn} = require("../middlewares/isLoggedIn");

module.exports.renderHistory = (req,res)=>{
  const userId = req.session.userId;
  if(!userId) return res.redirect("/login");
  const now = new Date();

  const query ="SELECT * FROM Tickets WHERE userId = ? ORDER BY bookingTime DESC";
  connection.query(query,[userId],(err,tickets)=>{
    if(err) 
      {
        req.flash("error","Error fetching tickets")
        return res.redirect("/interface");
      }

    // Below commented code to show only expired tickets
    // const tickets = results.filter(ticket => {
    //   const bookingDate = new Date(ticket.bookingTime);
    //   //return (now - bookingDate) > 24 * 60 * 60 * 1000;  //expired
    //   return (now - bookingDate) > 1* 60 * 1000; 
    // });

    for(const ticket of tickets)
    {
      const bookingDate = new Date(ticket.bookingTime);
      const now = new Date();
      ticket.bookingDateIST = new Date(ticket.bookingTime)
      .toLocaleString("en-IN",{timeZone: "Asia/kolkata"});
      ticket.qrImage = `/qrcodes/${ticket.ticketNumber}.png`;
      const expiryTime = new Date(bookingDate.getTime()+1*60*1000);
      ticket.expiryTime = expiryTime;
      if(now > expiryTime)
      {
        ticket.isExpired = true;
      }
      else{
        ticket.isExpired = false;
      }
      
      ticket.expiryIST = expiryTime
      .toLocaleString("en-IN",{timeZone:"Asia/Kolkata"});
    };

    

    res.render("pages/history.ejs",{tickets});
  })
}

