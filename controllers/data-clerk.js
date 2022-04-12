const express = require("express");
const router = express.Router();
const mealKitModel = require("../models/mealkits");
const mealKits = require("../models/mealkit-db");
const { default: mongoose } = require('mongoose');
const path = require("path");

router.get("/update/:id", function (req, res) {
    if (req.session.isClerk) { 
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
    }
    else {
        res.redirect("/");
    }
});

router.get("/delete/:id", function (req, res) {
    if (req.session.isClerk) { 
        mealKitModel.findByIdAndDelete(req.params.id)
        .exec()
        .then(() => {
            res.redirect("/dashboard/clerk");
        });
    }
    else {
        res.redirect("/");
    }
});

router.get("/delete-all", function (req, res) {
    if (req.session.isClerk) { 
        mealKitModel.deleteMany({})
        .exec()
        .then(data => {
            res.redirect("/dashboard/clerk");
        }).catch(err => {
            res.send("Error deleting mealkits");
        });
    }
    else {
        res.redirect("/");
    }
});

router.post("/update/:id", function (req, res) {
    if (req.session.isClerk) {
        const { title, includes, description, category, price, cookingTime, servings, caloriesPerServing, topMeal} = req.body;

        let passedValidation = true;
        let validationMessages = {};

        var priceRegex = /^\d+\.\d{2}$/;

        if (typeof title !== 'string' || title.trim().length === 0) {
            passedValidation = false;
            validationMessages.title = "Please add a title";
        }
        if (typeof includes !== 'string' || includes.trim().length === 0) {
            passedValidation = false;
            validationMessages.includes = "Please specify what the mealkit includes";
        }
        if (typeof description !== 'string' || description.trim().length === 0) {
            passedValidation = false;
            validationMessages.description = "Please add a description";
        }
        if (typeof category !== 'string' || category.trim().length === 0) {
            passedValidation = false;
            validationMessages.category = "Please add the category";
        }
        if (isNaN(price) || !priceRegex.test(price) || price.trim().length === 0) {
            passedValidation = false;
            validationMessages.price = "Please add a valid price (e.g. 9.99)";
        }
        if (isNaN(cookingTime) || cookingTime.trim().length === 0) {
            passedValidation = false;
            validationMessages.cookingTime = "Please add the cooking time (numbers only)";
        }
        if (isNaN(servings) || servings.trim().length === 0) {
            passedValidation = false;
            validationMessages.servings = "Please add the number of servings";
        }
        if (isNaN(caloriesPerServing) || caloriesPerServing.trim().length === 0) {
            passedValidation = false;
            validationMessages.caloriesPerServing = "Please enter the number of calories";
        }

        if(passedValidation) {
            const updatingMealkitID = mongoose.Types.ObjectId(req.params.id);
            mealKitModel.updateOne({ _id: updatingMealkitID }, {
                $set: {
                    title: title,
                    includes: includes,
                    description: description,
                    category: category,
                    price: price,
                    cookingTime: cookingTime,
                    servings: servings,
                    caloriesPerServing: caloriesPerServing,
                    topMeal: topMeal == "true"
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
                        mealKitModel.updateOne({ _id: updatingMealkitID }, {
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
        }
        else {
            var values = req.body;
            values.validationMessages = validationMessages;
            res.render("dashboard/clerk", {
                title: "Clerk Dashboard",
                editMealKit: values,
            });
        }
    }
    else {
        res.redirect("/");
    }
});

router.get("/create", function (req, res) {
    if (req.session.isClerk) {
        res.render("dashboard/clerk", {
            title: "Clerk Dashboard",
            createMealKit: true
        });
    }
    else {
        res.redirect("/");
    }
});

router.post("/create", function (req, res) {
    if (req.session.isClerk) {
        const { title, includes, description, category, price, cookingTime, servings, caloriesPerServing, topMeal } = req.body;

        let passedValidation = true;
        let validationMessages = {};

        var priceRegex = /^\d+\.\d{2}$/;

        if (typeof title !== 'string' || title.trim().length === 0) {
            passedValidation = false;
            validationMessages.title = "Please add a title";
        }
        if (typeof includes !== 'string' || includes.trim().length === 0) {
            passedValidation = false;
            validationMessages.includes = "Please specify what the mealkit includes";
        }
        if (typeof description !== 'string' || description.trim().length === 0) {
            passedValidation = false;
            validationMessages.description = "Please add a description";
        }
        if (typeof category !== 'string' || category.trim().length === 0) {
            passedValidation = false;
            validationMessages.category = "Please add the category";
        }
        if (isNaN(price) || !priceRegex.test(price) || price.trim().length === 0) {
            passedValidation = false;
            validationMessages.price = "Please add a valid price (e.g. 9.99)";
        }
        if (isNaN(cookingTime) || cookingTime.trim().length === 0) {
            passedValidation = false;
            validationMessages.cookingTime = "Please add the cooking time (numbers only)";
        }
        if (isNaN(servings) || servings.trim().length === 0) {
            passedValidation = false;
            validationMessages.servings = "Please add the number of servings";
        }
        if (isNaN(caloriesPerServing) || caloriesPerServing.trim().length === 0) {
            passedValidation = false;
            validationMessages.caloriesPerServing = "Please enter the number of calories";
        }

        if(passedValidation) {
            const newMealKit = new mealKitModel({
                title: title,
                includes: includes,
                description: description,
                category: category,
                price: price,
                cookingTime: cookingTime,
                servings: servings,
                caloriesPerServing: caloriesPerServing,
                topMeal: topMeal == "true"
            });
    
            newMealKit.save()
            .then((mealKitSaved) => {
                if(req.files !== null) {
                    let uniqueName = `mealkit-img-${mealKitSaved._id}${path.parse(req.files.mealkitImg.name).ext}`;
    
                    // Copy the image data to a file in the "public/profile-pictures" folder.
                    req.files.mealkitImg.mv(`public/mealkit-images/${uniqueName}`)
                    .then(() => {
                        // Update the user document so that it includes the image URL.
                        mealKitModel.updateOne({ _id: mealKitSaved._id }, {
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
                }
                else {
                    mealKitModel.updateOne({ _id: mealKitSaved._id }, {
                        imageUrl: "/images/default-mealkit-image.jpg"
                    })
                    .then(() => {
                        res.redirect("/dashboard/clerk");
                    })
                    .catch(err => {
                        console.log(`Error adding the mealkit picture url ... ${err}`);
                        res.redirect("/dashboard/clerk");
                    })
                }
            })
            .catch((err) => {
                console.log(`Error updating mealkit to the database ... ${err}`);
                res.redirect("/dashboard/clerk");
            });
        }
        else {
            res.render("dashboard/clerk", {
                title: "Clerk Dashboard",
                values: req.body,
                createMealKit: true,
                validationMessages
            });
        }
        
    }
    else {
        res.redirect("/");
    }
});

module.exports = router;