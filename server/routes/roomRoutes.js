const express = require('express');
const router = express.Router();

const roomsModel = require('../models/Room');

//Get all rooms
router.get('/getRooms', async (req, res) => {
    try {
        const rooms = await roomsModel.find();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//Add new room
router.post('/addRoom', async (req, res) => {
    const { imageUrl, roomNumber, roomType, facilities, price, status } = req.body;
    const newRoom = new roomsModel({ imageUrl, roomNumber, roomType, facilities, price, status });
    try {
        const room = await newRoom.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;