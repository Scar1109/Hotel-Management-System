const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userId: {
        type: String, // Change this to String if your userId is a custom string (like 'U83872')
        required: true,
    },
    eventId: {
        type: String,
        required: true,
    },
    reminderTime: {
        type: Date,
        required: true,
    },
    sentStatus: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
