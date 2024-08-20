const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
        },
        purchaseDate: {
            type: String,
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        customerID: {
            type: String,
            required: true,
        },
        amount : {
            type: Number,
            required: true,
        },
        status : {
            type: String,
            default: "Pending",
        },
        meals: [],
    },
    { timestamps: true }
);

const orderModel = mongoose.model("orders", orderSchema);
module.exports = orderModel;
