const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const connection = require("../db.js");
const { isLoggedIn } = require("../middlewares/isLoggedIn.js");
const puppeteer = require("puppeteer");

/* =========================
   TICKET FORM
========================= */

module.exports.renderTicketForm = (req, res) => {
  res.render("pages/ticketForm");
};



module.exports.ticketForm = async (req, res) => {

  const { fullName, aadhar, source, destination, busType, adults, children } = req.body;

  const userId = req.session.userId;
  if (!userId) 
  {
    req.flash("error","Please Login to book ticket")
    return res.redirect("/login");
  }
  req.session.bookingData = {
    fullName,
    aadhar,
    source,
    destination,
    busType,
    adults:parseInt(adults) || 0,
    children: parseInt(children) || 0
  };
  res.redirect("/interface/payment");
};
   

module.exports.renderpayment =  (req, res) => {
  const data = req.session.bookingData;

  if(!data) 
  {
    req.flash("error","Session Expired")
    return res.redirect('/interface');
  }
  let {source, destination, busType, adults, children } = data;

  adults = parseInt(adults) || 0;
  children = parseInt(children) || 0;

  const fareQuery = `
  SELECT adultFare,childFare 
  FROM BusFares
  WHERE source = ? AND destination = ? AND busType = ?
  `;

  connection.query(
    fareQuery,
    [source, destination, busType],
    (err,result) => {

      if(err) 
      {
        req.flash("error","Fare fetch error");
        return res.redirect("/interface/bookingTicket")
      }
      if(result.length == 0) 
      {
        req.flash("error","No Fare Found")
        return res.redirect("/interface/bookingTIcket");
      }

      // console.log(result);
      // console.log(result[0]);

      const adultFare = result[0].adultFare;
      const childFare = result[0].childFare;

      const totalFare = adults * adultFare + children * childFare;
      res.render("pages/payment",{totalFare});
    }
  )
    
};

module.exports.payment = async (req, res) => {
  
  const data = req.session.bookingData;

  if (!data) {
    return res.status(400).json({ error: "Session Expired" });
  }
  let {fullName, aadhar,source,destination,busType,adults,children} = data;

  const userId = req.session.userId;

  adults = parseInt(adults) || 0;
  children = parseInt(children) || 0;
  
  const isPaymentVerified = true;

  if (!isPaymentVerified) {
    return res.status(400).json({ error: "Payment Failed" });
  }

  const paymentId = "TXN" + Date.now();
  // Generate Ticket Number

  const date = new Date();
  const yymmdd = date.toISOString().slice(0,10).replace(/-/g,"");
  const randomNum = Math.floor(100 + Math.random() * 900);
  const ticketNumber = `TG${yymmdd}${randomNum}`;

  // Fetch Fare

  const fareQuery = `
  SELECT adultFare,childFare 
  From BusFares
  Where source = ? AND destination = ? AND busType = ?
  `;

  connection.query(
    fareQuery,
    [source,destination,busType],
    async (err,result) =>{
      if (err) {
        return res.status(500).json({ error: "Fare fetch error" });
      }


      if (result.length === 0) {
        return res.status(400).json({ error: "No fare found" });
      }
        console.log(result[0]);
      console.log(result);

      const adultFare = result[0].adultFare;
      const childFare = result[0].childFare;

      const totalFare = children * childFare + adults * adultFare;

      // Generate QR

      const qrData =JSON.stringify({
      Ticket: ticketNumber,
      From: source,
      To: destination,
      Bus: busType,
      Adults: adults,
      Children: children,
      Fare: totalFare,
      paymentId : paymentId
      })

      const qrPath = `public/qrcodes/${ticketNumber}.png`;

      try {
        await QRCode.toFile(qrPath, qrData);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "QR generation failed" });
      }

      // Insert Ticket

      const insertQuery = `
      INSERT INTO Tickets (
      fullName,
      ticketNumber,
      userId,
      aadhar,
      source,
      destination,
      busType,
      adults,
      children,
      adultFare,
      childFare,
      totalTickets,
      totalFare,
      paymentId,
      status,
      qrCode
      )
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;

      const totalTickets = adults + children;

      connection.query(insertQuery,
        [
          fullName,
          ticketNumber,
          userId,
          aadhar,
          source,
          destination,
          busType,
          adults,
          children,
          adultFare,
          childFare,
          totalTickets,
          totalFare,
          paymentId,
          "paid",
          qrPath
        ],
        (err) => {
          if (err) {
            console.log(err.sqlMessage);
            return res.status(500).json({ error: "Ticket booking error" });
          }

            delete req.session.bookingData;

            res.json({
              status: "success",
              ticketNumber,
              paymentId
            });
        }
      )
    }
  )
};

/* =========================
   SHOW TICKET PAGE
========================= */

module.exports.showTicket = (req, res) => {

  const ticketNumber = req.params.ticketNumber;

  const query = "SELECT * FROM Tickets WHERE ticketNumber = ?";

  connection.query(query, [ticketNumber], (err, results) => {

    if (err) 
      {
        req.flash("error","Database error")
        return res.redirect("/interface");
      }
    if (results.length === 0) 
    {
      req.flash("error","Ticket not found")
      return res.redirect("/interface");
    }

    const ticket = results[0];


    const bookingDate = new Date(ticket.bookingTime);

    const bookingDateIST = bookingDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });


    const validUntil = new Date(bookingDate);
    validUntil.setDate(validUntil.getDate() + 1);

    const validUntilIST = validUntil.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });


    res.render("pages/ticket", {
      ticketNumber: ticket.ticketNumber,
      source: ticket.source,
      destination: ticket.destination,
      fullName: ticket.fullName,
      adults: ticket.adults,
      children: ticket.children,
      bookingDateIST,
      validUntilIST,
      qrImage: `/qrcodes/${ticket.ticketNumber}.png`,
      paymentId:ticket.paymentId
    });

  });

};


/* =========================
   DOWNLOAD TICKET PDF
========================= */

module.exports.downloadTicket =  async (req, res) => {

  const ticketNumber = req.params.ticketNumber;

  try {

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    const url = `http://localhost:8080/interface/ticket/${ticketNumber}`;

    await page.goto(url, {
      waitUntil: "networkidle0"
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${ticketNumber}.pdf`
    });

    res.send(pdf);

  } catch (err) {

    console.log(err);
    req.flash("error","PDF generation error")
    res.redirect("/history");

  }

};

