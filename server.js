/************************************************************************************
* WEB322 – Project (Winter 2022)
* I declare that this assignment is my own work in accordance with Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Name: Liam Nugara
* Student ID: 122206204
* Course/Section: WEB322/NDD
*
************************************************************************************/

const path = require("path");
const express = require("express");
const exphbs = require('express-handlebars');
const app = express();
const mealKits = require("./models/mealkit-db");
const { resolveAny } = require("dns");

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    defaultLayout: "main"
}));
app.set('view engine', '.hbs');

// Set up body parser
app.use(express.urlencoded({ extended: false }));

// Add your routes here
// e.g. app.get() { ... }
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("home", {
        title: "Home Page",
        topMeals: mealKits.getTopMeals()
    });
});

app.get("/on-the-menu", function (req, res) {
    res.render("on-the-menu", {
        title: "On The Menu",
        mealCategories: mealKits.getMealsByCategory()
    });
});

app.get("/registration", function (req, res) {
    res.render("registration", {
        title: "Sign Up",
    });
});

app.post("/registration", function (req, res) {
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
        res.send("Success");
    }
    else {
        res.render("registration", {
            title: "Sign Up",
            values: req.body,
            validationMessages
        });
    }
});

app.get("/login", function (req, res) {
    res.render("sign-in", {
        title: "Login",
    });
});

// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);