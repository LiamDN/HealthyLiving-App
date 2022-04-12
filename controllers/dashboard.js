const express = require("express");
const router = express.Router();
const mealKitModel = require("../models/mealkits");
const mealKitSorters = require("../controllers/meal-sorters");

router.get("/", function (req, res) {
    if(req.session.isClerk) {
        res.redirect("/dashboard/clerk");
    }
    else if(req.session.isCustomer){
        res.redirect("/dashboard/customer");
    }
    else {
        res.redirect("/");
    }
});

router.get("/clerk", function (req, res) {
    if(req.session.isClerk) {
        mealKitModel.find()
        .exec()
        .then(data => {
            data = data.map(value => value.toObject());
            //console.log(data);
            res.render("dashboard/clerk", {
                title: "Clerk Dashboard",
                mealCategories: mealKitSorters.sortMealsByCategory(data),
                welcome: true
            });
        });
    }
    else {
        res.redirect("/");
    }
});

router.get("/customer", function (req, res) {
    if(req.session.isCustomer) {
        res.render("dashboard/customer", {
            title: "Customer Dashboard",
        });
    }
    else {
        res.redirect("/");
    }
});

module.exports = router;