const mongoose = require("mongoose");

const cateringSchema = new mongoose.Schema(
    {
        itemId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const cateringModel = mongoose.model("employee", cateringSchema);
module.exports = cateringModel;
