const express = require('express')
const router = express.Router();
const mealKitModel = require("../models/mealkits");
const { default: mongoose } = require('mongoose');

const mealKits = require("../models/mealkit-db");

router.get("/", function (req, res) {
    mealKitModel.find()
    .exec()
    .then(data => {
        data = data.map(value => value.toObject());
        res.render("general/home", {
            title: "Home Page",
            topMeals: mealKits.sortTopMeals(data)
        });
    });
});

router.get("/on-the-menu", function (req, res) {
    mealKitModel.find()
    .exec()
    .then(data => {
        data = data.map(value => value.toObject());
        res.render("general/on-the-menu", {
            title: "On The Menu",
            mealCategories: mealKits.sortMealsByCategory(data)
        });
    });
});

router.get("/welcome", function (req, res) {
    res.render("general/welcome", {
        title: "Welcome!",
    });
});

module.exports = router;