const express = require('express');
const router = express.Router();
const employeeModel = require('../models/Employee'); // Import the employee model for database operations
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
        const { firstName, lastName, email, username } = req.body; // Extract employee details from the request body

        // Check if the username or email already exists in the database
        const existingEmployee = await employeeModel.findOne({ $or: [{ email }, { username }] });
        if (existingEmployee) {
            return res.status(400).send('Email or Username already exists'); // Return an error if either exists
        }

        // Generate a unique employee ID
        const employeeId = await generateUniqueEmployeeId();

        // Generate a hashed password using bcrypt (using 'defaultpassword' as a placeholder)
        const password = bcrypt.hashSync('defaultpassword', 10); // Replace 'defaultpassword' with actual logic

        // Create a new employee document
        const newEmployee = new employeeModel({
            employeeId,
            userID: Math.random().toString(36).substr(2, 9), // Generate a random userID
            firstName,
            lastName,
            email,
            username,
            leaves: [], // Initialize an empty array for leaves
            password,
        });

        await newEmployee.save(); // Save the new employee to the database
        res.status(201).json(newEmployee); // Send a 201 response with the new employee data
    } catch (err) {
        res.status(500).send(err); // Send a 500 error if something goes wrong
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
