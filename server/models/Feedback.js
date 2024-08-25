const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({

    title : {
        type: String,
        required: true
    },

    username : {
        type: String,
        required: true
    },

    userID : {
        type: String,
        required: true
    },

    rating : {
        type: Number,
        required: true
    },

    description : {
        type: String,
        required: true
    },

},{
    timestamps: true
});

const feedbackModel = mongoose.model('feedbacks', FeedbackSchema);
module.exports = feedbackModel;