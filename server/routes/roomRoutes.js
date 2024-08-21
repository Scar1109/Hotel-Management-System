const express = require('express');
const router = express.Router();
const roomsModel = require('../models/Room'); // imported model

// Get all rooms
router.get('/getRooms', async (req, res) => {
    try {
        const rooms = await roomsModel.find();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Add new room
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

// Route to update a room
router.put('/updateRoom/:id', async (req, res) => {
    const { id } = req.params; // Room ID

    try {
        // Find and update the room by ID
        const updatedRoom = await roomsModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ room: updatedRoom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to delete a room
router.delete('/deleteRoom/:id', async (req, res) => {
    const { id } = req.params; // Room ID

    try {
        // Find and delete the room by ID
        const deletedRoom = await roomsModel.findByIdAndDelete(id);

        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ room: deletedRoom });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
