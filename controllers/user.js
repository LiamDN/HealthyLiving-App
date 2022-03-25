const express = require("express");
const userModel = require("../models/users");
const router = express.Router();

router.get("/registration", function (req, res) {
    res.render("user/registration", {
        title: "Sign Up",
    });
});

router.post("/registration", function (req, res) {
    const { firstName, lastName, email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};
    // Regular Expression taken and modified from https://www.ocpsoft.org/tutorials/regular-expressions/password-regular-expression/
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@#$%^&(){}\[\]:;\"\'<>,.?\/~`_+\-=|\\]).{8,12}$/;

    var emailRegex = /^[a-zA-Z0-9._\-+\/~!#$%^&()\[\]{}|\"\'*?:;<>,?]+@[a-zA-Z0-9._\/-]+\.[a-zA-Z]{2,3}$/;

    if (typeof firstName !== 'string' || firstName.trim().length === 0) {
        passedValidation = false;
        validationMessages.firstName = "Please specify first name";
    }
    if (typeof lastName !== 'string' || lastName.trim().length === 0) {
        passedValidation = false;
        validationMessages.lastName = "Please specify last name";
    }
    if (typeof email !== 'string' || email.trim().length === 0) {
        passedValidation = false;
        validationMessages.email = "Please enter email";
    }
    else if (!emailRegex.test(email)) {
        passedValidation = false;
        validationMessages.email = "Please enter a valid email address";
    }
    if (typeof password !== 'string' || password.trim().length === 0) {
        passedValidation = false;
        validationMessages.passwordNull = "Please enter a password";
    }
    else if (!passwordRegex.test(password)) {
        passedValidation = false;
        validationMessages.passwordInvalid = true;
    }
    // Add send verification email and add user to the database
    if(passedValidation) {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
            to: email,
            from: "lnugara1@myseneca.ca",
            subject: "HealthyLiving Sign Up Confirmation",
            html: 
                `
                Welcome ${firstName}!<br><br>
                
                Your HealthyLiving account has been created.<br><br>

                Please review your account details:<br>
                Full Name: ${firstName} ${lastName}<br>
                Email Address: ${email}<br><br>

                Return to the home page: https://web322-lnugara1.herokuapp.com<br><br>

                Author: Liam Nugara, Website Name: HealthyLiving<br>
                `
        } ;

        sgMail.send(msg)
        .then(() => {
            res.redirect('/welcome/?nm=' + firstName + "&em=" + email);
        })
        .catch(err => {
            console.log(`Error ${err}`);
            validationMessages.email = "Invalid email, confirmation could not be sent to " + email;

            res.render("user/registration", {
                title: "Sign Up",
                values: req.body,
                validationMessages
            });
        });

        const user = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });

        user.save()
        .then((userSaved) => {
            console.log(`User ${userSaved.firstName} has been added to the database.`);
        })
        .catch((err) => {
            console.log(`Error adding user to the database: ${err}`);
        })
    }
    else {
        res.render("user/registration", {
            title: "Sign Up",
            values: req.body,
            validationMessages
        });
    }
});

router.get("/login", function (req, res) {
    res.render("user/sign-in", {
        title: "Login",
    });
});

router.post("/login", function (req, res) {
    const { email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    if (typeof email !== 'string' || email.trim().length === 0) {
        passedValidation = false;
        validationMessages.email = "Please enter email";
    }
    if (typeof password !== 'string' || password.trim().length === 0) {
        passedValidation = false;
        validationMessages.password = "Please enter a password";
    }
    
    if(passedValidation) {
        res.redirect("/welcome");
    }
    else {
        res.render("user/sign-in", {
            title: "Log In",
            values: req.body,
            validationMessages
        });
    }
});

module.exports = router;