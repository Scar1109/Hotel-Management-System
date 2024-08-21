const express = require('express');
const router = express.Router();
const employeeModel = require('../models/Employee');
const bcrypt = require('bcrypt');

// Function to generate unique employee ID
async function generateUniqueEmployeeId() {
    let unique = false;
    let employeeId;
    
    while (!unique) {
        employeeId = Math.random().toString(36).substr(2, 9);
        const existingEmployee = await employeeModel.findOne({ employeeId });
        if (!existingEmployee) {
            unique = true;
        }
    }
    
    return employeeId;
}

// Get all employees
router.get('/getEmployees', async (req, res) => {
    try {
        const employees = await employeeModel.find();
        res.json(employees);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add new employee
router.post('/addEmployee', async (req, res) => {
    try {
        const { firstName, lastName, email, username } = req.body;

        // Validate if username or email already exists
        const existingEmployee = await employeeModel.findOne({ $or: [{ email }, { username }] });
        if (existingEmployee) {
            return res.status(400).send('Email or Username already exists');
        }

        // Generate a unique employee ID
        const employeeId = await generateUniqueEmployeeId();

        // Generate a password
        const password = bcrypt.hashSync('defaultpassword', 10); // Replace 'defaultpassword' with actual logic

        const newEmployee = new employeeModel({
            employeeId,
            userID: Math.random().toString(36).substr(2, 9),
            firstName,
            lastName,
            email,
            username,
            leaves: [],
            password,
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update employee
router.post('/updateEmployee', async (req, res) => {
    try {
        const { employeeId, firstName, lastName, email, username } = req.body;

        const existingEmployee = await employeeModel.findOne({ _id: { $ne: employeeId }, $or: [{ email }, { username }] });
        if (existingEmployee) {
            return res.status(400).send('Email or Username already exists');
        }

        const updatedEmployee = await employeeModel.findOneAndUpdate(
            { employeeId },
            { firstName, lastName, email, username },
            { new: true }
        );

        res.json(updatedEmployee);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete employee
router.post('/deleteEmployee', async (req, res) => {
    try {
        const { employeeId } = req.body;
        await employeeModel.findOneAndDelete({ employeeId });
        res.send('Employee deleted successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
