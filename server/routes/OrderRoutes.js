const express = require('express');
const router = express.Router();
const orderModel = require('../models/Order');

// Function to generate a unique order ID
async function generateUniqueOrderId() {
    let unique = false;
    let orderId;

    while (!unique) {
        const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        orderId = `O${randomNumber}`;
        const existingOrder = await orderModel.findOne({ orderId });
        if (!existingOrder) {
            unique = true;
        }
    }

    return orderId;
}

// Route to get all orders
router.get('/getOrders', async (req, res) => {
    try {
        const orders = await orderModel.find(); // Fetch all orders
        res.json({ orders }); // Wrap the response in an object
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to get a single order by ID
router.get('/getOrder/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findOne({ orderId });

        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.json(order);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to add a new order
router.post('/addOrder', async (req, res) => {
    try {
        const { purchaseDate, customerName, customerID, amount, meals } = req.body;

        const orderId = await generateUniqueOrderId();
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
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to update an order
router.put('/updateOrder/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { purchaseDate, customerName, customerID, amount, meals, status } = req.body;

        const updatedOrder = await orderModel.findOneAndUpdate(
            { orderId },
            { purchaseDate, customerName, customerID, amount, meals, status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).send('Order not found');
        }

        res.json(updatedOrder);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to update only the status of an order
router.patch('/updateOrderStatus/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await orderModel.findOneAndUpdate(
            { orderId },
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).send('Order not found');
        }

        res.json(updatedOrder);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to delete an order
router.delete('/deleteOrder/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await orderModel.findOneAndDelete({ orderId });

        if (!deletedOrder) {
            return res.status(404).send('Order not found');
        }

        res.send('Order deleted successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
