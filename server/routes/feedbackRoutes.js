    const express = require("express");
    const router = express.Router();
    const feedbackModel = require("../models/Feedback");

    // Retrieve feedback with pagination
    router.post("/getFeedback", async (req, res) => {
    const { page, limit} = req.body;
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
        const { search, page, limit } = req.body;
    
        try {
            const searchTerms = search.split(" "); // Split the search input by spaces
    
            // Build the query to search for both title and username
            const query = {
                $or: [
                    { title: { $regex: searchTerms.join("|"), $options: "i" } }, // Match any word in the title
                    { username: { $regex: searchTerms.join("|"), $options: "i" } }, // Match any word in the username
                ],
            };
    
            const feedbacks = await feedbackModel
                .find(query)
                .skip((page - 1) * limit)
                .limit(limit);
    
            const total = await feedbackModel.countDocuments(query);
    
            res.json({ feedbacks, total });
        } catch (error) {
            res.status(500).json({ message: "Error searching feedbacks" });
        }
    });

    // Search feedback by title and filter by userID
    router.post("/getFeedbackByUserId", async (req, res) => {
        const { search, page, limit, userID } = req.body;
        if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }
    
        try {
            const searchTerms = search ? search.split(" ") : [];
            const query = {
                userID: userID,
                $or: searchTerms.length > 0 ? [
                    { title: { $regex: searchTerms.join("|"), $options: "i" } },
                    { username: { $regex: searchTerms.join("|"), $options: "i" } },
                ] : [{}]
            };
    
            const feedbacks = await feedbackModel
                .find(query)
                .skip((page - 1) * limit)
                .limit(limit);
    
            const total = await feedbackModel.countDocuments(query);
    
            res.json({ feedbacks, total });
        } catch (error) {
            res.status(500).json({ message: "Error searching feedbacks" });
        }
    });

    router.post("/getFeedback", async (req, res) => {
        const { page, limit } = req.body;
        try {
            const feedbacks = await feedbackModel
                .find({})
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }); // Latest feedback first
            const total = await feedbackModel.countDocuments();
            res.json({ feedbacks, total });
        } catch (error) {
            res.status(500).json({ message: "Error fetching feedbacks" });
        }
    });
    
    // Get total feedback count
    router.get("/feedbackCount", async (req, res) => {
        try {
            const count = await feedbackModel.countDocuments(); // Get total count of feedbacks
            res.json({ count });
        } catch (error) {
            res.status(500).json({ message: "Error fetching feedback count" });
        }
    });

// Get average feedback ratings by month
router.get("/feedbackRatingsByMonth", async (req, res) => {
    try {
        const feedbacks = await feedbackModel.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month
                    averageRating: { $avg: "$rating" }, // Calculate average rating
                },
            },
            {
                $sort: { _id: 1 }, // Sort by month
            },
        ]);
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedback ratings" });
    }
});

// Get feedback ratings summary (for progress bars)
router.get("/ratingsSummary", async (req, res) => {
    try {
        const feedbackSummary = await feedbackModel.aggregate([
            {
                $group: {
                    _id: "$rating", // Group by rating (1 to 5)
                    count: { $sum: 1 }, // Count how many feedbacks per rating
                },
            },
            {
                $sort: { _id: -1 }, // Sort by rating (5 stars first)
            },
        ]);

        // Calculate the total feedback count
        const totalFeedback = await feedbackModel.countDocuments();
        const averageRating = await feedbackModel.aggregate([
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" },
                },
            },
        ]);

        res.json({
            total: totalFeedback,
            ratings: feedbackSummary,
            average: averageRating.length > 0 ? averageRating[0].avgRating : 0,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching ratings summary" });
    }
});


    module.exports = router;
