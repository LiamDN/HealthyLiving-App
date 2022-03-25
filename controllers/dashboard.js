const express = require("express");
const router = express.Router();

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
        res.render("dashboard/clerk", {
            title: "Clerk Dashboard",
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