module.exports.sortMealsByCategory = function(arr) {
    var filtered = [];   

    for (var i = 0; i < arr.length; i++) {
        var categoryFound = false;
        for (var j = 0; j < filtered.length && !categoryFound; j++) {
            if(arr[i].category === filtered[j].categoryName) {
                filtered[j].mealKits.push(arr[i]);
                categoryFound = true;
            }
        }
        if(!categoryFound)
        filtered.push({
            categoryName: arr[i].category,
            mealKits: [arr[i]]
        });
    }
    return filtered;
};

module.exports.sortTopMeals = function(arr) {
    var filtered = [];

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].topMeal) {
            filtered.push(arr[i]);
        }
    }

    return filtered;
};