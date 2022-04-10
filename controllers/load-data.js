const express = require('express')
const router = express.Router();
const mealKitModel = require("../models/mealkits");
const mealKits = require("../models/mealkit-db");
const { default: mongoose } = require('mongoose');
const path = require("path");

router.get("/", function (req, res) {
    res.render("general/home", {
        title: "Home Page",
        topMeals: mealKits.getTopMeals()
    });
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
                                mealCategories: mealKits.sortMealsByCategory(data),
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
                        mealCategories: mealKits.sortMealsByCategory(data),
                        welcome: true,
                        message: "Meal kits have already been added to the database"
                    });
                });
            }
        });
    }
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

router.get("/delete-all", function (req, res) {
    mealKitModel.deleteMany({})
    .exec()
    .then(data => {
        res.redirect("/dashboard/clerk");
    }).catch(err => {
        res.send("Error deleting mealkits");
    });
});

router.post("/save/:id", function (req, res) {
    const { title, includes, description, category, price, cookingTime, servings, caloriesPerServing, topMeal} = req.body;
    const updatingMealkitID = mongoose.Types.ObjectId(req.params.id);
    mealKitModel.updateOne({_id: updatingMealkitID}, {
        $set: {
            title: title,
            includes: includes,
            description: description,
            category: category,
            price: price,
            cookingTime: cookingTime,
            servings: servings,
            caloriesPerServing: caloriesPerServing,
            topMeal: topMeal
        }
    })
    .exec()
    .then((mealKitUpdated) => {
        console.log("Successfully update the for " + req.params.id);

        let uniqueName = `mealkit-img-${updatingMealkitID}${path.parse(req.files.mealkitImg.name).ext}`;

        // Copy the image data to a file in the "public/profile-pictures" folder.
        req.files.mealkitImg.mv(`public/mealkit-images/${uniqueName}`)
        .then(() => {
        // Update the user document so that it includes the image URL.
            mealKitModel.updateOne({_id: updatingMealkitID}, {
                imageUrl: `/mealkit-images/${uniqueName}`
            })
            .then(() => {
                console.log("Mealkit document was updated with the picture.");
                res.redirect("/dashboard/clerk");
            })
            .catch(err => {
                console.log(`Error updating the mealkit picture ... ${err}`);
                res.redirect("/dashboard/clerk");
            })
        });
    })
    .catch((err) => {
        console.log(`Error updating mealkit to the database ... ${err}`);
        res.redirect("/dashboard/clerk");
    });
});

router.get("/create", function (req, res) {
    res.render("dashboard/clerk", {
        title: "Clerk Dashboard",
        createMealKit: true
    });
});

router.post("/create", function (req, res) {
    const { title, includes, description, category, price, cookingTime, servings, caloriesPerServing, topMeal} = req.body;

    const newMealKit = new mealKitModel({
        title: title,
        includes: includes,
        description: description,
        category: category,
        price: price,
        cookingTime: cookingTime,
        servings: servings,
        caloriesPerServing: caloriesPerServing,
        topMeal: topMeal
    });

    newMealKit.save()
    .then((mealKitSaved) => {
        let uniqueName = `mealkit-img-${mealKitSaved._id}${path.parse(req.files.mealkitImg.name).ext}`;

        // Copy the image data to a file in the "public/profile-pictures" folder.
        req.files.mealkitImg.mv(`public/mealkit-images/${uniqueName}`)
        .then(() => {
        // Update the user document so that it includes the image URL.
            mealKitModel.updateOne({_id: mealKitSaved._id}, {
                imageUrl: `/mealkit-images/${uniqueName}`
            })
            .then(() => {
                console.log("Mealkit document was updated with the picture.");
                res.redirect("/dashboard/clerk");
            })
            .catch(err => {
                console.log(`Error updating the mealkit picture ... ${err}`);
                res.redirect("/dashboard/clerk");
            })
        });
    })
    .catch((err) => {
        console.log(`Error updating mealkit to the database ... ${err}`);
        res.redirect("/dashboard/clerk");
    });
});

module.exports = router;