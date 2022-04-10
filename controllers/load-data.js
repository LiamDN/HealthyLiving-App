const express = require('express')
const router = express.Router();
const mealKitModel = require("../models/mealkits");
const mealKits = require("../models/mealkit-db");
const { default: mongoose } = require('mongoose');

router.get("/", function (req, res) {
    res.render("general/home", {
        title: "Home Page",
        topMeals: mealKits.getTopMeals()
    });
});

router.get("/meal-kits", function (req, res) {
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
                    res.send("Success, data was uploaded!");
                }
            });
        }
        else {
            res.send("There are already documents loaded.");
        }
    });
});

router.get("/update/:id", function (req, res) {
    mealKitModel.findById(req.params.id)
    .exec()
    .then(data => {
        data = data.toObject();
        console.log(data);
        res.render("dashboard/clerk", {
            title: "Clerk Dashboard",
            editMealKit: data
        });
    });
});

router.get("/delete/:id", function (req, res) {
    mealKitModel.findByIdAndDelete(req.params.id)
    .exec()
    .then(() => {
        res.redirect("/dashboard/clerk");
    });
});

router.post("/save/:id", function (req, res) {
    const { title, includes, description, category, price, cookingTime, servings, caloriesPerServing, imageUrl, topMeal} = req.body;
    console.log("Test: " + topMeal);
    mealKitModel.updateOne({_id: mongoose.Types.ObjectId(req.params.id)}, {
        $set: {
            title: title,
            includes: includes,
            description: description,
            category: category,
            price: price,
            cookingTime: cookingTime,
            servings: servings,
            caloriesPerServing: caloriesPerServing,
            imageUrl: imageUrl,
            topMeal: topMeal
        }
    })
    .exec()
    .then(() => {
        console.log("Successfully update the name for " + req.params.id);

        res.redirect("/dashboard/clerk");
    });
    
});

module.exports = router;