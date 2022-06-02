const express = require("express");
const router = express.Router();
const mealKitModel = require("../models/mealkits");
const { default: mongoose } = require('mongoose');

router.get("/shopping-cart", function (req, res) {
    if (req.session.isCustomer) { 
        let cart = req.session.shoppingCart || [];
        
        res.render("dashboard/customer", {
            title: "Shopping Cart",
            showCart: true,
            totalPrice: calculateTotal(cart)
        });
    }
    else {
        res.redirect("/");
    }
});

router.get("/check-out", function (req, res) {
    if (req.session.isCustomer) { 
        let cart = req.session.shoppingCart || [];

        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        let emailMsg = 
        `
        Hi ${req.session.user.firstName}!<br><br>
        
        Thank you for shopping with us. Your order details are as follows:<br><br>
        `

        cart.forEach((cartItem) => {
            if(cartItem.qty > 0) {
                emailMsg = emailMsg + 
                `
                ${cartItem.data.title} | Price: ${cartItem.data.price} <br>
                Quantity: ${cartItem.qty} | Total Price: ${cartItem.extPrice} <br><br>
                `
            }
        });

        emailMsg = emailMsg + 
        `
        Return to the home page: https://web322-lnugara1.herokuapp.com<br><br>

        Author: Liam Nugara, Website Name: HealthyLiving<br>
        `

        const msg = {
            to: req.session.user.email,
            from: "lnugara1@myseneca.ca",
            subject: "HealthyLiving Order Confirmation",
            html: emailMsg
        } ;

        sgMail.send(msg)
            .then(() => {
  
            })
            .catch(err => {
                // If email couldn't be sent
                console.log(`Error ${err}`);
                validationMessages.email = "Invalid email, confirmation could not be sent to " + email;
                });

        req.session.shoppingCart = [];

        res.render("dashboard/customer", {
            title: "Shopping Cart",
            showCart: true,
            message: "Thank you for your purchase, you are now checked out.",
            totalPrice: calculateTotal(cart)
        });
    }
    else {
        res.redirect("/");
    }
});

router.get("/add-mealkit/:id", (req, res) => {
    mealKitModel.findById(req.params.id)
        .exec()
        .then(data => {
            if(data !== null) {
                let message;

                data = data.toObject();
                console.log(data);
                
                if(req.session.isCustomer) {
                    let cart = req.session.shoppingCart = req.session.shoppingCart || [];

                    let found = false;
                    cart.forEach(cartMeal => {
                        if (cartMeal.id == req.params.id) {
                            found = true;
                            cartMeal.qty++;
                            cartMeal.extPrice = parseFloat((cartMeal.data.price * cartMeal.qty).toFixed(2));
                        }
                    });
                    if (found) {
                        message = data.title + " was already in the cart, increased the quantity by one.";
                    }
                    else {
                        cart.push({
                            id: req.params.id,
                            qty: 1,
                            data,
                            extPrice: parseFloat(JSON.parse(data.price))
                        });
                        message = data.title + " added to cart."
                    }

                    // Render mealkit description page
                    res.render("general/mealkit-description", {
                        title: "Mealkit | " + data.title,
                        mealkit: data,
                        toastMessage: message
                    });
                }
                else {
                    res.render("general/mealkit-description", {
                        title: "Mealkit | " + data.title,
                        mealkit: data,
                        toastMessage: "You must be logged in to add to cart."
                    });
                }
            }
            else {
                res.render("general/error", {
                    message: "Meakit does not exist"
                });
            }
        })    
});

router.get("/add-one-mealkit/:id", (req, res) => {
    mealKitModel.findById(req.params.id)
        .exec()
        .then(data => {
            if(data !== null) {

                data = data.toObject();
                console.log(data);
                
                if(req.session.isCustomer) {
                    let cart = req.session.shoppingCart = req.session.shoppingCart || [];

                    cart.forEach(cartMeal => {
                        if (cartMeal.id == req.params.id) {
                            cartMeal.qty++;
                            cartMeal.extPrice = parseFloat((cartMeal.data.price * cartMeal.qty).toFixed(2));
                        }
                    });

                    res.render("dashboard/customer", {
                        title: "Shopping Cart",
                        showCart: true,
                        totalPrice: calculateTotal(cart)
                    });
                }
                else {
                    res.redirect("/");
                }
            }
            else {
                res.redirect("/");
            }
        })    
});

router.get("/remove-one-mealkit/:id", (req, res) => {
    mealKitModel.findById(req.params.id)
        .exec()
        .then(data => {
            if(data !== null) {

                data = data.toObject();
                console.log(data);
                
                if(req.session.isCustomer) {
                    let cart = req.session.shoppingCart = req.session.shoppingCart || [];

                    cart.forEach(cartMeal => {
                        if (cartMeal.id == req.params.id && cartMeal.qty > 0) {
                            cartMeal.qty--;
                            cartMeal.extPrice = parseFloat(cartMeal.data.price * cartMeal.qty).toFixed(2);
                        }
                    });

                    res.render("dashboard/customer", {
                        title: "Shopping Cart",
                        showCart: true,
                        totalPrice: calculateTotal(cart)
                    });
                }
                else {
                    res.redirect("/");
                }
            }
            else {
                res.redirect("/");
            }
        })    
});

router.get("/remove-mealkit/:id", (req, res) => {
    mealKitModel.findById(req.params.id)
        .exec()
        .then(data => {
            if(data !== null) {

                data = data.toObject();
                console.log(data);
                
                if(req.session.isCustomer) {
                    let cart = req.session.shoppingCart = req.session.shoppingCart || [];

                    var deleteIndex = cart.findIndex(cartMeal => cartMeal.id == req.params.id);
                    cart.splice(deleteIndex, 1);

                    res.render("dashboard/customer", {
                        title: "Shopping Cart",
                        showCart: true,
                        totalPrice: calculateTotal(cart)
                    });
                }
                else {
                    res.redirect("/");
                }
            }
            else {
                res.redirect("/");
            }
        })    
});

function calculateTotal(cart) {
    var total = 0.00;
    cart.forEach((cartItem) => {
        total += cartItem.extPrice;
    });
    return parseFloat(total).toFixed(2);
}

module.exports = router;