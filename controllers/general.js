const express = require('express')
const router = express.Router();
const mealKitModel = require("../models/mealkits");
const { default: mongoose } = require('mongoose');

const mealKitSorters = require("../controllers/meal-sorters");

router.get("/", function (req, res) {
    mealKitModel.find()
    .exec()
    .then(data => {
        data = data.map(value => value.toObject());
        res.render("general/home", {
            title: "Home Page",
            topMeals: mealKitSorters.sortTopMeals(data) // Filters the top meals mealkits from database 
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
            mealCategories: mealKitSorters.sortMealsByCategory(data) // Sorts the mealkits from database by category
        });
    });
});

router.get("/welcome", function (req, res) {
    res.render("general/welcome", {
        title: "Welcome!",
    });
});

module.exports = router;