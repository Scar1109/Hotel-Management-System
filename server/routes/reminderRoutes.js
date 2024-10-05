const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminder'); // Reminder model

// Set a reminder for an event
router.post('/setReminder', async (req, res) => {
    const { userId, eventId } = req.body;

    try {
        // Automatically calculate reminderTime (1 second in the future)
        const now = new Date();
        now.setSeconds(now.getSeconds() + 1); // Add 1 second to the current time
        const reminderTime = now.toISOString(); // Convert to ISO format

        console.log(`Reminder time set for: ${reminderTime}`);

        // Check if the reminder already exists for this user and event
        const existingReminder = await Reminder.findOne({ userId, eventId });
        if (existingReminder) {
            return res.status(400).json({ message: 'Reminder already set for this event.' });
        }

        // Create and save the new reminder
        const newReminder = new Reminder({
            userId, // userId is passed in from the request
            eventId, // eventId is passed in from the request
            reminderTime, // Use the reminder time set 1 second in the future
            sentStatus: false, // Reminder has not been sent yet
        });

        await newReminder.save();
        res.status(201).json({ message: 'Reminder set successfully.' });
    } catch (error) {
        console.error('Error setting reminder:', error);
        res.status(500).json({ message: 'Error setting reminder.', error: error.message });
    }
});

// Test route to send an email
router.get('/sendTestEmail', async (req, res) => {
    try {
        const userEmail = 'recipient-email@example.com'; // Replace with a test email
        const event = {
            eventName: 'Test Event',
            eventDate: new Date().toISOString(),  // Current time as event date
        };

        // Call the email sending function
        await sendReminderEmail(userEmail, event);

        res.status(200).json({ message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ message: 'Error sending test email', error: error.message });
    }
});

module.exports = router;
