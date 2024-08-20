const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    
    userID: {
        type: String,
        required: false,
    },

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        default: "Customer",
    },
    
},{ timestamps: true });

const User = mongoose.model("user", userSchema);

module.exports = User;
