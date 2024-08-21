const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Function to generate a unique user ID
const generateUserID = async () => {
    let userID;
    let userExists;

    do {
        // Generate a random number and prepend with 'U'
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        userID = `U${randomNum}`;

        // Check if this userID already exists in the database
        userExists = await User.findOne({ userID });

    } while (userExists);

    return userID;
};

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, username } = req.body;

        // Check if all required fields are present
        if (!firstName || !lastName || !email || !password || !confirmPassword || !username) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if the email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already in use' });
        }

        // Generate a unique userID
        const userID = await generateUserID();

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            userID, // Assign the generated userID
            firstName,
            lastName,
            email,
            password: hashedPassword,
            username,
        });

        const savedUser = await newUser.save();

        // Exclude password from the response
        const userResponse = {
            _id: savedUser._id,
            userID: savedUser.userID,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            username: savedUser.username,
            userType: savedUser.userType,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        };

        res.status(201).json({ message: 'User registered successfully', user: userResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
