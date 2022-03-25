const express = require('express')
const router = express.Router();

const mealKits = require("../models/mealkit-db");

router.get("/", function (req, res) {
    res.render("general/home", {
        title: "Home Page",
        topMeals: mealKits.getTopMeals()
    });
});

router.get("/on-the-menu", function (req, res) {
    res.render("general/on-the-menu", {
        title: "On The Menu",
        mealCategories: mealKits.getMealsByCategory()
    });
});

router.get("/welcome", function (req, res) {
    if(req.query.nm && req.query.em) {
        res.render("welcome", {
            title: "Welcome!",
            userInfo: {
                firstName: req.query.nm,
                email: req.query.em
            }
        });
    }
    else {
        res.render("welcome", {
            title: "Welcome!",
        });
    }
});

module.exports = router;