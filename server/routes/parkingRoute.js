const express = require('express');
const router = express.Router();

const parkingModel = require('../models/Parking');

router.get('/availability', async (req, res) => {
    const { date, userID } = req.query;
    try {
        const bookings = await parkingModel.find({ bookingDate: date, userID });
        const bookedSlots = bookings.map(booking => booking.parkingId);
        const allSlots = Array.from({ length: 50 }, (_, i) => i < 20 ? `B${i + 1}` : `C${i - 19}`);
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        res.json(availableSlots);
    } catch (error) {
        res.status(500).json({ message: "Error fetching availability" });
    }
});

// Endpoint to book a parking slot
router.post('/book', async (req, res) => {
    const { vehicleNumber, parkingSlot, date, duration, userID, Price } = req.body;
    try {
        const existingBooking = await parkingModel.findOne({ parkingId: parkingSlot, date });
        if (existingBooking) {
            return res.status(400).json({ message: "Slot already booked for this date." });
        }
        const newBooking = new parkingModel({
            parkingId: parkingSlot,
            vehicleNumber,
            bookingDate: date,
            packageType: duration,
            userID,
            price : Price
        });
        await newBooking.save();
        res.json({ message: "Parking slot booked successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error booking the parking slot." });
    }
});

module.exports = router;