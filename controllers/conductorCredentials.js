const express = require("express");
const {v4:uuidv4} = require("uuid");
const connection = require("../db");
const bcrypt = require("bcrypt");

module.exports.renderConductorRegistration = (req,res) => {
    res.render("pages/conductorRegistration.ejs",{
        fullNameError: null,
        employeeIdError: null,
        emailError: null,
        phoneError: null,
        licenseNumberError: null,
        passwordError: null,
        confirmPasswordError: null,
        termsError:null

    })
}

module.exports.conductorRegistration = (req,res) => {
    const {fullName, employeeId, email, phone, licenseNumber, password,confirmPassword,terms} = req.body;

    let errors = {
        fullNameError: null,
        employeeIdError: null,
        emailError: null,
        phoneError: null,
        licenseNumberError: null,
        passwordError: null,
        confirmPasswordError: null,
        termsError:null
    };

    if(!fullName) errors.fullNameError = "Name is required";
    if(!employeeId) errors.employeeIdError = "EmployeeId is required";
    if(!email) errors.emailError = "Email is required";
    if(!phone) errors.phoneError = "Phone Number is required";
    if(!licenseNumber) errors.licenseNumberError = "Licesnse Number is required";
    if(!password) errors.passwordError = "Password is required";
    if(!confirmPassword) errors.confirmPasswordError = "Confirm Password is required";
    if(!terms) errors.termsError = "Please select terms & conditions";

    if(Object.values(errors).some(err => err !== null)){
        return res.render("pages/conductorRegistration",errors)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        errors.emailError = "Invalid email format"
    }

    if(!/^[0-9]{10}$/.test(phone)){
        errors.phoneError = "Phone Number must be 10 digits";
    }

    if(password.length < 6)
    {
        errors.passwordError = "Password must be at least 6 characters";
    }

    if(password !== confirmPassword)
    {
        errors.confirmPasswordError = "Passwords do not match";
    }

    if(Object.values(errors).some(err => err !== null)){
        return res.render("pages/conductorRegistration",errors);
    }

    const checkConductorIdQuery = "SELECT * FROM Conductor WHERE employeeId = ?"

    connection.query(checkConductorIdQuery, [employeeId], (err,conductorResult) => {
        if(err) throw err;

        if(conductorResult.length > 0){
            return res.render("pages/conductorRegistration.ejs",{
                fullNameError: null,
                employeeIdError:"Employee Id already exists!",
                emailError: null,
                phoneError: null,
                licenseNumberError: null,
                passwordError: null,
                confirmPasswordError: null,
                termsError: null
            })
        }

        const checkLicenseQuery = "SELECT * FROM Conductor WHERE licenseNumber = ?";
        connection.query(checkLicenseQuery,[licenseNumber],async(err1,licenseResult) =>{
            if(err1) throw err1;

            if(licenseResult.length > 0){
                return res.render("pages/conductorRegistration",{
                    fullNameError: null,
                    employeeIdError: null,
                    emailError: null,
                    phoneError: null,
                    licenseNumberError: "License Number already exists!",
                    passwordError: null,
                    confirmPasswordError: null,
                    termsError: null
                })
            }
        
        
            const hashedPassword = await bcrypt.hash(password,10);
            const insertQuery= 
            "INSERT INTO Conductor(fullName, employeeId,email,phone,licenseNumber,password) VALUES (?,?,?,?,?,?)"
            connection.query(insertQuery,[fullName,employeeId,email,phone,licenseNumber,hashedPassword],(err2) => {
                if(err2) throw err2;

                console.log("Registered Successfully");

                req.session.employeeId = employeeId;
                req.flash("success","Registered Successfully");
                res.redirect("/interface");

            })
        })
    })
}

module.exports.renderConductorLogin = (req,res)=>{
    res.render("pages/conductor-login.ejs",{error:null});
}


module.exports.conductorLogin = (req,res) => {
    const {employeeId,password,busNumber,route} = req.body;

    if(!employeeId || !password || !busNumber || !route)
    {
        return res.render("pages/conductor-login.ejs", {
            error: "Please provide all the details"
        });
    }

    const q = "SELECT * FROM Conductor WHERE employeeId = ?";

    connection.query(q,[employeeId], async(err,results) => {
        if(err) throw err;

        if(results.length == 0)
        {
            return res.render("pages/conductor-login.ejs",{error:"employeeId  is not available"});
        }
        const conductor = results[0];

        const isMatch = await bcrypt.compare(password,conductor.password);

        if(!isMatch)
        {
            return res.render("pages/conductor-login.ejs",{error:"invalid employee id or password"})
        }

        req.session.employeeId = conductor.employeeId;
        req.session.busNumber = busNumber;
        req.session.route = route;
        req.session.conductorName = conductor.fullName;
        req.session.journeyStartTime = new Date();


        req.flash("success","Login Successful");
        const redirectUrl = req.session.redirectUrl || "/conductor/interface";
        delete req.session.redirectUrl;
        res.redirect(redirectUrl);
    })
}
