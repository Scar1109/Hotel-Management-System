const express = require('express');
const router = express.Router();
const employeeModel = require('../models/Employee'); // Import the employee model for database operations
const User = require('../models/User');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Function to generate a unique employee ID
async function generateUniqueEmployeeId() {
    let unique = false;
    let employeeId;

    while (!unique) {
        // Generate a random 8-digit number prefixed with 'E'
        const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
        employeeId = `E${randomNumber}`;
        
        // Check if this employeeId already exists in the database
        const existingEmployee = await employeeModel.findOne({ employeeId });
        if (!existingEmployee) {
            unique = true; // If no existing employee with this ID, mark it as unique
        }
    }
    
    return employeeId; // Return the unique employee ID
}

// Route to get all employees
router.get('/getEmployees', async (req, res) => {
    try {
        const employees = await employeeModel.find(); // Fetch all employees from the database
        res.json(employees); // Send the employee data as a JSON response
    } catch (err) {
        res.status(500).send(err); // Send a 500 error if something goes wrong
    }
});

// Route to add a new employee
router.post('/addEmployee', async (req, res) => {
    try {
        const { firstName, lastName, email, username } = req.body;

        // Check if the username or email already exists in the database
        const existingEmployee = await employeeModel.findOne({ $or: [{ email }, { username }] });
        if (existingEmployee) {
            return res.status(400).send('Email or Username already exists as Employee');
        }

        // Check if the email or username already exists in the User collection
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already in as Customer' });
        }

        // Generate a unique employee ID
        const employeeId = await generateUniqueEmployeeId();
        let randomPwd = Math.random().toString(36).substr(2, 9);
        console.log(randomPwd);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPwd, salt);

        // Create a new employee document
        const newEmployee = new employeeModel({
            employeeId,
            userID: Math.random().toString(36).substr(2, 9),
            firstName,
            lastName,
            email,
            username,
            leaves: [],
            password : hashedPassword,
        });

        // Save the new employee to the database
        await newEmployee.save();

        const userID = employeeId;

        // Create the new User
        const newUser = new User({
            userID,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            username,
            userType: "Employee",
        });

        const savedUser = await newUser.save();

        // Exclude the password from the response
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

        res.status(201).json({
            message: 'Employee added and registered as user successfully',
            employee: newEmployee,
            user: userResponse
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Route to update an existing employee
router.post('/updateEmployee', async (req, res) => {
    try {
        const { firstName, lastName, email, username } = req.body; // Extract updated employee details from the request body

        // Find the employee by email and update their details
        const updatedEmployee = await employeeModel.findOneAndUpdate(
            { email },
            { firstName, lastName, username },
            { new: true } // Return the updated document
        );

        res.json(updatedEmployee); // Send the updated employee data as a JSON response
    } catch (err) {
        res.status(500).send(err); // Send a 500 error if something goes wrong
    }
});

// Route to delete an employee
router.post('/deleteEmployee', async (req, res) => {
    try {
        const { employeeId } = req.body; // Extract the employeeId from the request body
        await employeeModel.findOneAndDelete({ employeeId }); // Find the employee by ID and delete them
        res.send('Employee deleted successfully'); // Send a success message
    } catch (err) {
        res.status(500).send(err); // Send a 500 error if something goes wrong
    }
});

module.exports = router; // Export the router to use it in the main application
