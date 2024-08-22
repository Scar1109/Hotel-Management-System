const express = require('express');
const router = express.Router();

const cateringModel = require('../models/Catering');

// Function to generate a unique item ID
async function generateUniqueItemId() {
    let unique = false;
    let itemId;

    while (!unique) {
        const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        itemId = `I${randomNumber}`;
        
        const existingItem = await cateringModel.findOne({ itemId });
        if (!existingItem) {
            unique = true;
        }
    }
    
    return itemId;
}

// Route to get all food items
router.get('/getItems', async (req, res) => {
    try {
        const items = await cateringModel.find();
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to add a new food item
router.post('/addItem', async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        const itemId = await generateUniqueItemId();

        const newItem = new cateringModel({
            itemId,
            name,
            description,
            price,
            category
        });

        await newItem.save();

        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to update a food item
router.post('/updateItem', async (req, res) => {
    try {
        const { itemId, name, description, price, category } = req.body;

        const updatedItem = await cateringModel.findOneAndUpdate(
            { itemId },
            { name, description, price, category },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).send('Item not found');
        }

        res.json(updatedItem);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to delete a food item
router.post('/deleteItem', async (req, res) => {
    try {
        const { itemId } = req.body;

        const deletedItem = await cateringModel.findOneAndDelete({ itemId });

        if (!deletedItem) {
            return res.status(404).send('Item not found');
        }

        res.send('Item deleted successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;