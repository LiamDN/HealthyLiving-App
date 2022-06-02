const express = require("express");
const router = express.Router();
const mealKitModel = require("../models/mealkits");
const mealKits = require("../models/mealkit-db");
const { default: mongoose } = require('mongoose');
const path = require("path");
const axios = require('axios');
const FormData = require('form-data');

router.get("/update/:id", function (req, res) {
    if (req.session.isClerk) { 
        mealKitModel.findById(req.params.id)
            .exec()
            .then(data => {
                data = data.toObject();
                console.log(data);
                // Render update page with mealkit data
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

        // Mealkit input fields validation
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

                // Create unique image name for file
                let uniqueName = `mealkit-img-${updatingMealkitID}${path.parse(req.files.mealkitImg.name).ext}`;

                req.files.mealkitImg.mv(`public/mealkit-images/${uniqueName}`)
                    .then(() => {
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
                            });
                    });
            })
            .catch((err) => {
                console.log(`Error updating mealkit to the database ... ${err}`);
                res.redirect("/dashboard/clerk");
            });
        }
        else {
            // If didnt pass validation, rerender update page with same data and validation messages
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

        // Mealkit input fields validation
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
                    var data = new FormData();
                    data.append('image', req.files.mealkitImg.data, req.files.mealkitImg.name);

                    var config = {
                        method: 'post',
                        url: 'https://api.imgur.com/3/image',
                        headers: { 
                          'Authorization': 'Client-ID 3ab58ab8bc0d617', 
                          ...data.getHeaders()
                        },
                        data: data
                      };

                    axios(config)
                    .then(response => {
                        console.log(response.data.data.link);
                        mealKitModel.updateOne({ _id: mealKitSaved._id }, {
                            imageUrl: response.data.data.link
                        })
                        .then(() => {
                            console.log("Mealkit document was updated with the picture.");
                            res.redirect("/dashboard/clerk");
                        })
                        .catch(err => {
                            console.log(`Error updating the mealkit picture ... ${err}`);
                            res.redirect("/dashboard/clerk");
                        })
                    })
                    .catch(error => {
                        console.log(error);
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
                console.log(`Error adding mealkit to the database ... ${err}`);
                res.redirect("/dashboard/clerk");
            });
        }
        else {
            // If didnt pass validation, rerender update page with same data and validation messages
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