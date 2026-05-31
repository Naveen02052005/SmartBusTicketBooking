const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const router = express.Router();

module.exports.renderHome = (req,res)=>{
  res.render("pages/home");
}

module.exports.renderInterface = (req,res)=>{
    res.render("pages/Interface",{
      isLoggedIn: req.session.userId ? true : false
    });
}

module.exports.renderConductor = (req,res) => {
  res.render("pages/conductorInterface",{
    isLogged: req.session.employeeId ? true : false
  });
}