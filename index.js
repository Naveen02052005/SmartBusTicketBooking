const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");


const interface = require("./routes/homePages.js");
const login = require("./routes/users.js");
const bookingTicket = require("./routes/bookingTicket.js");
const history = require("./routes/history.js");
const conductorCredentials = require("./routes/conductorCredentials.js");
const conductorActive = require("./routes/conductor.js");



app.engine("ejs", ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));



const mysql=require("mysql2");

const {v4:uuidv4} = require("uuid");

const session = require("express-session");
const { timeStamp } = require("console");
const { connect } = require("http2");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 60 * 24 * 1,
      maxAge: 1000 * 60 * 60 * 24 * 1,
      httpOnly: true,
    }
}));

app.use((req,res,next)=>{
  res.set("Cache-Control","no-store");
  next();
});

app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.isLoggedIn = req.session.userId ? true : false;
  res.locals.isConductorLogged = req.session.employeeId ? true : false;
  next();
})



app.get("/logout",(req,res)=>{
  req.session.userId = null;
  req.flash("success","Logout Successful");
  res.redirect("/interface");
});

app.get("/conductor/logout", (req, res) => {
    req.session.employeeId = null;
        req.flash("success","Logout Successful");
        res.redirect("/conductor/interface");

});



app.use("/",interface);
app.use("/",login);
// app.use("/",login);
app.use("/interface",bookingTicket);
app.use("/",history);
app.use("/",conductorCredentials);
app.use("/",conductorActive);



app.get("/ticket",(req,res)=>{
  res.render("pages/ticket")
})

// app.get("/history",(req,res) => {
//   res.render("pages/history");
// })




// // Get journey statistics


app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
})

