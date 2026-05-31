const express = require("express");
const {v4:uuidv4} = require("uuid")
const router = express.Router({mergeParams: true});
const connection = require("../db");
const bcrypt = require("bcrypt");
;

module.exports.renderRegistration = (req, res) => {
    res.render("pages/registration", {
        nameError: null,
        emailError: null,
        phoneError: null,
        passwordError: null,
        confirmError: null
    });
};


module.exports.registration = async (req,res)=>{
    const {fullName,email,phone,password,ConfirmPassword}=req.body;

    let errors = {
        nameError: null,
        emailError: null,
        phoneError: null,
        passwordError: null,
        confirmError: null
    };

    if (!fullName) errors.nameError = "Name is required";
    if (!email) errors.emailError = "Email is required";
    if (!phone) errors.phoneError = "Phone is required";
    if (!password) errors.passwordError = "Password is required";
    if (!ConfirmPassword) errors.confirmError = "Confirm password required";

    if (Object.values(errors).some(err => err !== null)) {
        return res.render("pages/registration", errors);
    }


      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.emailError = "Invalid email format"
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        errors.phoneError = "Phone number must be 10 digits"
      }

      if (password.length < 6) {
          errors.emailError = "Password must be at least 6 characters"
      }

      if (password !== ConfirmPassword) {
          errors.confirmError = "Passwords do not match"
      }

      if (Object.values(errors).some(err => err !== null)) {
        return res.render("pages/registration", errors);
    }
  
      const hashedPassword = await bcrypt.hash(password,10);

      const checkUserQuery = "SELECT * FROM Users WHERE fullName = ?";
      connection.query(checkUserQuery, [fullName], (err, userResults) => {
        if (err) throw err;
    
        if (userResults.length > 0) {
          return res.render("pages/registration.ejs", {
            nameError: "Username already exists. Try another one.",
            emailError: null,
            phoneError:null,
            passwordError:null,
            confirmError:null
          });
        }
    
        const checkEmailQuery = "SELECT * FROM Users WHERE email = ?";
        connection.query(checkEmailQuery, [email], (err2, emailResults) => {
          if (err2) throw err2;
    
          if (emailResults.length > 0) {
            return res.render("pages/registration.ejs", {
              nameError: null,
              emailError: "Email already exists. Try another one.",
              phoneError:null,
              passwordError:null,
              confirmError:null
            });
          }
    
          const userId = uuidv4();
          const insertQuery =
            "INSERT INTO Users (userId, fullName, email,phone, password) VALUES (?, ?, ?, ?,?)";
          connection.query(insertQuery, [userId, fullName, email, phone, hashedPassword], (err3) => {
            if (err3) throw err3;
    
            console.log("Registered successfully");

            req.session.userId = userId;
            req.flash("success","Registered Succesfully");
            // res.redirect("/interface");
            const redirectUrl = req.session.redirectUrl || "/interface";
            delete req.session.redirectUrl
            res.redirect(redirectUrl);
          });
        });
      });
}


module.exports.renderLogin = (req,res)=>{
    res.render("pages/login.ejs",{error:null});
}

module.exports.login = (req,res)=>{
    const {userName, password}=req.body;

    if(!userName || !password)
    {
        return res.status(400).json({
            success:false,
            message:"Please provide userName/email and password"
        })
    }

    const q = "SELECT * FROM Users WHERE fullName = ?  OR email = ?"
    connection.query(q,[userName,userName,password], async(err,results)=>{
        if(err) throw err;
        
        if(results.length == 0)
        {
            
            return res.render("pages/login.ejs",{error:"Username or password is not available"});
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch)
        {
          return res.render("pages/login",{
            error:"invalid username or password"
          });
        }
        req.session.userId = user.userId
        req.flash("success","Login Succesfully");
        const redirectUrl = req.session.redirectUrl || "/interface";
        delete req.session.redirectUrl
        res.redirect(redirectUrl);
    })
}
