var mealkits = [
    { 
        title: "Grilled Salmon", 
        includes: "Arugula & Cherry Tomato Salad", 
        description: "Wild Atlantic Salmon on a peppery & zesty salad.", 
        category: "Classic Dinner Meals", 
        price: 12.99, 
        cookingTime: 30, 
        servings: 1, 
        caloriesPerServing: 230, 
        imageUrl: "/default-mealkit-images/grilledsalmon.jpg", 
        topMeal: false 
    },
    { 
        title: "French Toast", 
        includes: "Farmfresh rasberries & perfectly ripe bananas", 
        description: "Hearty 'Texas' French toast with a hint of vanila & real Ceylon cinnamon.", 
        category: "Breakfast", 
        price: 8.99, 
        cookingTime: 20, 
        servings: 2, 
        caloriesPerServing: 230, 
        imageUrl: "/default-mealkit-images/frenchtoast.jpg", 
        topMeal: true 
    },
    { 
        title: "Vegan Pizza", 
        includes: "Wild mushrooms, red peppers, arugala, & vegan cheese", 
        description: "You wont believe it's Vegan pizza!", 
        category: "Vegan", 
        price: 10.99, 
        cookingTime: 30, 
        servings: 2, 
        caloriesPerServing: 150, 
        imageUrl: "/default-mealkit-images/veganpizza.jpg", 
        topMeal: false 
    },
    { 
        title: "Paella", 
        includes: "Fresh little neck clams, shrimp, sweet mussels", 
        description: "An authentic taste of Spain. It's a classic done right.",
        category: "Classic Dinner Meals", 
        price: 13.99, 
        cookingTime: 50, 
        servings: 4, 
        caloriesPerServing: 200, 
        imageUrl: "/default-mealkit-images/paella.jpg", 
        topMeal: false
    },
    { 
        title: "Vegan Sushi", 
        includes: "Spicy mayo dipping sauce", 
        description: "A party in your mouth with each bite. Umami!",
        category: "Vegan", 
        price: 9.99, 
        cookingTime: 30, 
        servings: 2, 
        caloriesPerServing: 110, 
        imageUrl: "/default-mealkit-images/vegansushi.jpg", 
        topMeal: true 
    },
    { 
        title: "Enchiladas", 
        includes: "Authenic refried beans, pickeled onions, fresh avocado and salad", 
        description: "Shredded slow cooked chicken in traditional spices in a soft taco shell.",
        category: "Classic Dinner Meals", 
        price: 11.99, 
        cookingTime: 40, 
        servings: 2, 
        caloriesPerServing: 250, 
        imageUrl: "/default-mealkit-images/enchiladas.jpg", 
        topMeal: false 
    },
    { 
        title: "Seafood Pasta", 
        includes: "Fresh shrimp & bay scallops", 
        description: "Sweet & salty seafood in a marinara sauce.",
        category: "Classic Dinner Meals", 
        price: 11.99, 
        cookingTime: 30, 
        servings: 2, 
        caloriesPerServing: 220, 
        imageUrl: "/default-mealkit-images/pasta.jpg", 
        topMeal: false
    },
    { 
        title: "Eggs Benedict", 
        includes: "Refreshing green salad", 
        description: "Two perfectly poached eggs & smoked salmon, smothered with real Hollandaise sauce, on a toasted English muffin.",
        category: "Breakfast", 
        price: 13.99, 
        cookingTime: 45, 
        servings: 1, 
        caloriesPerServing: 240, 
        imageUrl: "/default-mealkit-images/eggsbenedict.jpg", 
        topMeal: true 
    }
];

module.exports.getTopMeals = function() {
    var filtered = [];

    for (var i = 0; i < mealkits.length; i++) {
        if (mealkits[i].topMeal) {
            filtered.push(mealkits[i]);
        }
    }

    return filtered;
};

module.exports.getMealsByCategory = function() {
    var filtered = [];   

    for (var i = 0; i < mealkits.length; i++) {
        var categoryFound = false;
        for (var j = 0; j < filtered.length && !categoryFound; j++) {
            if(mealkits[i].category === filtered[j].categoryName) {
                filtered[j].mealKits.push(mealkits[i]);
                categoryFound = true;
            }
        }
        if(!categoryFound)
        filtered.push({
            categoryName: mealkits[i].category,
            mealKits: [mealkits[i]]
        });
    }
    return filtered;
};

module.exports.getAllMeals = function() {
    return mealkits;
};