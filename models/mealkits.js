const mongoose = require("mongoose");

// Mealkit schema
const mealKitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    includes: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cookingTime: {
        type: Number,
        required: true
    },
    servings: {
        type: Number,
        required: true
    },
    caloriesPerServing: {
        type: Number,
        required: true
    },
    imageUrl: String,
    topMeal: {
        type: Boolean,
        required: true
    },
});
mealKitSchema.set('toObject', {getters: true});

const mealKitModel = mongoose.model("mealkits", mealKitSchema);

module.exports = mealKitModel;