const express = require('express');
const router = express.Router();
const orderModel = require('../models/Order');
const MealPlan = require('../models/MealPlan'); // Corrected path for mealPlanModel
const Catering = require('../models/Catering'); // Corrected path for Catering model


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
        const { purchaseDate, customerName, customerID, amount, meals,roomNumber } = req.body;

        const orderId = await generateUniqueOrderId();
        const newOrder = new orderModel({
            orderId,
            purchaseDate,
            customerName,
            customerID,
            roomNumber,
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



router.post('/updateItem', async (req, res) => {
    try {
        const { orderId, purchaseDate, customerName, customerID, amount, meals, status } = req.body;

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

router.post('/deleteItem', async (req, res) => {
    try {
        const { orderId } = req.body;
        const deletedOrder = await orderModel.findOneAndDelete({ orderId });

        if (!deletedOrder) {
            return res.status(404).send('Order not found');
        }

        res.send('Order deleted successfully');
    } catch (err) {
        res.status(500).send(err);
    }
}
);

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

// Get meal plan for a customer
router.get('/mealPlan/:customerID', async (req, res) => {
    try {
        const { customerID } = req.params;
        const mealPlan = await MealPlan.findOne({ customerID });  // Corrected model reference
        const meals = await Catering.find({});  // Assuming Catering model is correctly defined elsewhere
        
        if (!mealPlan) {
            return res.json({ mealPlan: [], meals });  // Returning consistent format even when no meal plan is found
        }
        
        res.json({ mealPlan: mealPlan.mealPlan, meals });  // Returning meal plan details and available meals
    } catch (error) {
        console.error('Error fetching meal plan:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Save or update meal plan for a customer
router.post('/mealPlan', async (req, res) => {
    const { customerID, mealPlan } = req.body;

    try {
        // Upsert option used to create or update based on existence of meal plan
        const updatedMealPlan = await MealPlan.findOneAndUpdate(
            { customerID },
            { $set: { mealPlan } },
            { new: true, upsert: true }  // upsert option to handle both creation and update
        );

        res.json({ message: 'Meal plan saved successfully', mealPlan: updatedMealPlan });
    } catch (error) {
        console.error('Error saving meal plan:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


module.exports = router;
