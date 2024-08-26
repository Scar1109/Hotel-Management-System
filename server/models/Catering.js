const mongoose = require("mongoose");

const cateringSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
    },
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
    },
    type: {
      type: String,
      enum: ["vegi", "non vegi"], // Restrict the field to "vegi" or "non vegi"
      required: true, // Set it to true if it's a required field
    },
  },
  { timestamps: true }
);

const cateringModel = mongoose.model("caterings", cateringSchema);
module.exports = cateringModel;
