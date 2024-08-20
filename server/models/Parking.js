const mongoose = require('mongoose');

const parkingSchema = new mongoose.Schema({
    packageId : {
        type: String,
        required: true,
    },
    packageType : {
        type: String,
        required: true,
    },
    eventType : {
        type: String,
        required: true,
    },
    price : {
        type: Number,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    baseImage : {
        type: String,
        required: true,
    },
    inventories : [],
    extras : [],
    contentImages: [],

}, { timestamps: true });

const parkingModel = mongoose.model("parkings", parkingSchema);
module.exports = parkingModel;