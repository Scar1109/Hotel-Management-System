const mongoose = require('mongoose');

// Define the Room schema
const roomSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    roomNumber: {
        type: String,
        required: true,
        unique: true, // Ensure roomNumber is unique
    },
    roomType: {
        type: String,
        required: true,
    },
    facilities: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Activate', 'Suspended'],
        default: 'Activate',
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the Room model
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
