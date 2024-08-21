const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({

    imageUrl: {
        type: String,
        required: true,
    },
    roomNumber: {
        type: String,
        required: true,
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

},{
    timestamps: true
});

const roomModel = mongoose.model('rooms', roomSchema);
module.exports = roomModel;