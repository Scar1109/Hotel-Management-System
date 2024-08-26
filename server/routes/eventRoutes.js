const express = require('express');
const router = express.Router();

const eventModel = require('../models/Event');
const eventBookingModel = require('../models/eventBooking');

router.get('/getEvents', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const events = await eventModel.find({
            eventName: { $regex: search, $options: 'i' } // case-insensitive search
        })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

        const totalEvents = await eventModel.countDocuments({
            eventName: { $regex: search, $options: 'i' }
        });

        res.status(200).json({ events, totalPages: Math.ceil(totalEvents / limit) });
    } catch (err) {
        console.error('Error retrieving events:', err.message); // Log the error
        res.status(500).json({ message: 'Error retrieving events', error: err.message });
    }
});

// Get a specific event by eventId
router.get('/getEvent/:id', async (req, res) => {
    try {
        const event = await eventModel.findOne({ eventId: req.params.id });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ event });
    } catch (err) {
        console.error('Error retrieving event:', err.message); // Log the error
        res.status(500).json({ message: 'Error retrieving event', error: err.message });
    }
});

router.post('/addEvent', async (req, res) => {
    try {
        const { eventName, eventType, price, description, baseImage } = req.body;
        const eventId = 'EVT' + Date.now(); // generate a unique event ID

        const existingEvent = await eventModel.findOne({ eventName });
        if (existingEvent) {
            return res.status(400).json({ message: 'Event already exists' });
        }

        const newEvent = new eventModel({
            eventId,
            eventName,
            eventType,
            price,
            description,
            baseImage,
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding event', error: err.message });
    }
});

router.post('/deleteEvent', async (req, res) => {
    try {
        const { eventId } = req.body;
        const deletedEvent = await eventModel.findOneAndDelete({ eventId });

        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting event', error: err.message });
    }
});

router.post('/updateEvent', async (req, res) => {
    try {
        const { eventId, eventName, eventType, price, description, baseImage } = req.body;

        const event = await eventModel.findOne({ eventId });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.eventName = eventName;
        event.eventType = eventType;
        event.price = price;
        event.description = description;
        event.baseImage = baseImage;

        await event.save();
        res.status(200).json({ message: 'Event updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating event', error: err.message });
    }
});

// Booking events

// Function to generate a new booking ID
const generateBookingID = async () => {
    const lastBooking = await eventBookingModel.findOne().sort({ bookingID: -1 }).limit(1);
    if (!lastBooking) {
        return 'BOK001';
    }
    const lastID = parseInt(lastBooking.bookingID.substring(3));
    const newID = lastID + 1;
    return `BOK${newID.toString().padStart(3, '0')}`;
};

// Add booking route
router.post('/reserveEvent/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { guestName, guestEmail, guestPhone, eventDate, totalAmount, userID } = req.body;

        const bookingID = await generateBookingID(); // Generate the booking ID

        const newBooking = new eventBookingModel({
            bookingID, // Save the generated booking ID
            eventId,
            guestName,
            guestEmail,
            guestPhone,
            eventDate,
            totalAmount,
            userID
        });

        await newBooking.save();
        res.status(201).json({ message: 'Reservation successful', bookingID });
    } catch (error) {
        res.status(500).json({ message: 'Error reserving event', error: error.message });
    }
});


// Get all bookings for a user
router.get('/getBookings', async (req, res) => {
    try {
        const { userID } = req.query; // Retrieve userID from query params
        const bookings = await eventBookingModel.find({ userID });
        res.status(200).json({ bookings });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching bookings', error: err.message });
    }
});

// Update booking
router.put('/updateBooking/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { guestName, guestEmail, guestPhone, eventDate } = req.body;

        await eventBookingModel.findByIdAndUpdate(bookingId, {
            guestName,
            guestEmail,
            guestPhone,
            eventDate
        });

        res.status(200).json({ message: 'Booking updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating booking', error: err.message });
    }
});

// Delete booking
router.delete('/deleteBooking/:bookingId', async (req, res) => {
    try {
        const { bookingId } = req.params;
        const deletedBooking = await eventBookingModel.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting booking', error: err.message });
    }
});

module.exports = router;