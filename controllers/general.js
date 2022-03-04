const express = require('express')
const router = express.Router();

const mealKits = require("../models/mealkit-db");

router.get("/", function (req, res) {
    res.render("home", {
        title: "Home Page",
        topMeals: mealKits.getTopMeals()
    });
});

router.get("/on-the-menu", function (req, res) {
    res.render("on-the-menu", {
        title: "On The Menu",
        mealCategories: mealKits.getMealsByCategory()
    });
});

router.get("/registration", function (req, res) {
    res.render("registration", {
        title: "Sign Up",
    });
});

router.post("/registration", function (req, res) {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};

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
    if (typeof password !== 'string' || password.trim().length === 0) {
        passedValidation = false;
        validationMessages.password = "Please enter a password";
    }
    
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
                Email Address: ${email}<br>
                `
        } ;

        sgMail.send(msg)
            .then(() => {
                res.send("Success, email sent.");
            })
            .catch(err => {
                console.log(`Error ${err}`);

                res.render("registration", {
                    title: "Sign Up",
                    values: req.body,
                    validationMessages
                });
            });
    }
    else {
        res.render("registration", {
            title: "Sign Up",
            values: req.body,
            validationMessages
        });
    }
});

router.get("/login", function (req, res) {
    res.render("sign-in", {
        title: "Login",
    });
});

module.exports = router;