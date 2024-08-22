    const express = require("express");
    const router = express.Router();
    const feedbackModel = require("../models/Feedback");

    // Retrieve feedback with pagination
    router.post("/getFeedback", async (req, res) => {
    const { page, limit } = req.body;
    try {
        const feedbacks = await feedbackModel
        .find({})
        .skip((page - 1) * limit)
        .limit(limit);
        const total = await feedbackModel.countDocuments();
        res.json({ feedbacks, total });
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedbacks" });
    }
    });

    // Add new feedback
    router.post("/addFeedback", async (req, res) => {
        try {
            console.log("Received data:", req.body);
    
            const { title, username, rating, description, userID } = req.body;
    
            if (!title || !username || rating === undefined || !description || !userID) {
                console.error("Missing required fields");
                return res.status(400).json({ error: "All fields are required" });
            }
    
            const feedback = new feedbackModel({
                title,
                username,
                userID, 
                rating,
                description,
            });
    
            await feedback.save();
            return res.status(201).json({ message: "Feedback added successfully" });
        } catch (error) {
            console.error("Error adding feedback:", error.message);
            return res.status(500).json({ error: "Error adding feedback", details: error.message });
        }
    });

    // Update existing feedback
    router.post("/updateFeedback", async (req, res) => {
    const { feedbackID, title, username, rating, description } = req.body;
    try {
        const feedback = await feedbackModel.findById(feedbackID);
        if (!feedback)
        return res.status(404).json({ message: "Feedback not found" });

        feedback.title = title;
        feedback.username = username;
        feedback.rating = rating;
        feedback.description = description;

        await feedback.save();
        res.json({ message: "Feedback updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating feedback" });
    }
    });

    // Delete feedback
    router.post("/deleteFeedback", async (req, res) => {
    const { feedbackID } = req.body;
    try {
        const feedback = await feedbackModel.findById(feedbackID);
        if (!feedback)
        return res.status(404).json({ message: "Feedback not found" });

        await feedback.deleteOne();
        res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting feedback" });
    }
    });

    // Search feedback by title
    router.post("/searchFeedback", async (req, res) => {
    const { title, page, limit } = req.body;
    try {
        const feedbacks = await feedbackModel
        .find({ title: new RegExp(title, "i") })
        .skip((page - 1) * limit)
        .limit(limit);
        const total = await feedbackModel.countDocuments({
        title: new RegExp(title, "i"),
        });
        res.json({ feedbacks, total });
    } catch (error) {
        res.status(500).json({ message: "Error searching feedbacks" });
    }
    });

    module.exports = router;
