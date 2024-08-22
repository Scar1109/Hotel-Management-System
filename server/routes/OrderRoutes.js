const express = require('express');
const router = express.Router();
const orderModel = require('../models/Order'); // Import the order model for database operations

// Function to generate a unique order ID
async function generateUniqueOrderId() {
    let unique = false;
    let orderId;

    while (!unique) {
        // Generate a random 10-digit number prefixed with 'O'
        const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        orderId = `O${randomNumber}`;
        
        // Check if this orderId already exists in the database
        const existingOrder = await orderModel.findOne({ orderId });
        if (!existingOrder) {
            unique = true; // If no existing order with this ID, mark it as unique
        }
    }
    
    return orderId; // Return the unique order ID
}

// Route to get all orders
router.get('/getOrders', async (req, res) => {
    try {
        const orders = await orderModel.find(); // Fetch all orders from the database
        res.json(orders); // Send the order data as a JSON response
    } catch (err) {
        res.status(500).send(err); // Send a 500 error if something goes wrong
    }
});

// Route to add a new order
router.post('/addOrder', async (req, res) => {
    try {
        const { purchaseDate, customerName, customerID, amount, meals } = req.body;

        console.log('Received Order Data:', req.body); // Log incoming data

        const orderId = await generateUniqueOrderId();
        console.log('Generated Order ID:', orderId); // Log generated ID

        const newOrder = new orderModel({
            orderId,
            purchaseDate,
            customerName,
            customerID,
            amount,
            meals,
            status: "Pending"
        });

        await newOrder.save();
        console.log('Saved Order:', newOrder); // Log saved order

        res.status(201).json(newOrder);
    } catch (err) {
        console.error('Error Saving Order:', err); // Log any errors
        res.status(500).send(err);
    }
});


// Route to update an existing order
router.post('/updateOrder', async (req, res) => {
    try {
        const { orderId, purchaseDate, customerName, customerID, amount, meals, status } = req.body; // Extract updated order details from the request body

        // Find the order by orderId and update its details
        const updatedOrder = await orderModel.findOneAndUpdate(
            { orderId },
            { purchaseDate, customerName, customerID, amount, meals, status },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).send('Order not found'); // Return a 404 error if the order was not found
        }

        res.json(updatedOrder); // Send the updated order data as a JSON response
    } catch (err) {
        res.status(500).send(err); // Send a 500 error if something goes wrong
    }
});

// Route to delete an order
router.post('/deleteOrder', async (req, res) => {
    try {
        const { orderId } = req.body; // Extract the orderId from the request body
        const deletedOrder = await orderModel.findOneAndDelete({ orderId }); // Find the order by ID and delete it

        if (!deletedOrder) {
            return res.status(404).send('Order not found'); // Return a 404 error if the order was not found
        }

        res.send('Order deleted successfully'); // Send a success message
    } catch (err) {
        res.status(500).send(err); // Send a 500 error if something goes wrong
    }
});

module.exports = router; // Export the router to use it in the main application
