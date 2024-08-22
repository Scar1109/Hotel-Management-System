const mongoose = require('mongoose');

// Define the Room Reservation schema
const ReservationSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
    },
    guestName: {
        type: String,
        required: true,
    },
    guestEmail: {
        type: String,
        required: true,
    },
    packages: [{
        type: mongoose.Schema.Types.ObjectId, // Assuming packages are references to other documents
        ref: 'Package' // Replace with the correct model name for packages
    }],
    guestPhone: {
        type: String,
        required: true,
    },
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;
