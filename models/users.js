const bcrypt = require("bcryptjs")
const mongoose = require("mongoose");

// User schema
const userSchema= new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

userSchema.pre("save", function(next) {
    let user = this;

    // Generate salt
    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(user.password, salt)
        .then(hashedPwd => {
            // Password hashed and user model saved
            user.password = hashedPwd;
            next();
        })
        .catch(err => {
            console.log(`Error occurred while hashing ${err}`);
        })
    })
    .catch(err => {
        console.log(`Error occurred while hashing ${err}`);
    });
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;