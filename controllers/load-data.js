const express = require('express')
const router = express.Router();
const mealKitModel = require("../models/mealkits");
const mealKits = require("../models/mealkit-db");
const mealKitSorters = require("../controllers/meal-sorters");
const { default: mongoose } = require('mongoose');
const path = require("path");

router.get("/", function (req, res) {
    res.redirect("/");
});

router.get("/meal-kits", function (req, res) {
    if(req.session.isClerk) {
        mealKitModel.find().count({}, (err, count) => {
            if (err) {
                res.send("Couldn't count the documents: " + err);
            }
            else if (count === 0) {
                // No documents exist.  Add them now.
                var mealKitsToAdd = mealKits.getAllMeals();
    
                mealKitModel.collection.insertMany(mealKitsToAdd, (err, docs) => {
                    if (err) {
                        res.send("Coudn't insert the meals: " + err);
                    }
                    else {
                        mealKitModel.find()
                        .exec()
                        .then(data => {
                            data = data.map(value => value.toObject());
                            //console.log(data);
                            res.render("dashboard/clerk", {
                                title: "Clerk Dashboard",
                                mealCategories: mealKitSorters.sortMealsByCategory(data),
                                welcome: true,
                                message: "Added meal kits to the database"
                            });
                        });
                    }
                });
            }
            else {
                mealKitModel.find()
                .exec()
                .then(data => {
                    data = data.map(value => value.toObject());
                    //console.log(data);
                    res.render("dashboard/clerk", {
                        title: "Clerk Dashboard",
                        mealCategories: mealKitSorters.sortMealsByCategory(data),
                        welcome: true,
                        message: "Meal kits have already been added to the database"
                    });
                });
            }
        });
    }
    else {
        res.render("general/error", {
            message: "You are not authorized to add meal kits."
        });
    }
});

module.exports = router;