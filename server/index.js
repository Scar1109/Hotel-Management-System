const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

// Database configuration (ensure your dbConfig is correctly set up)
const dbConfig = require("./config/db");

// Importing route files
const cateringRoutes = require("./routes/cateringRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const eventRoutes = require("./routes/eventRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const packageRoutes = require("./routes/packageRoutes");
const parkingRoutes = require("./routes/parkingRoute");
const userRoutes = require("./routes/userRoute");
const roomRoutes = require("./routes/roomRoutes");

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your React frontend URL if it's hosted elsewhere
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],  // Add any other headers you need
    credentials: true  // Allow cookies or authentication headers (if required)
}));

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Define routes (ensure routes are applied after middleware)
app.use("/api/catering", cateringRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/room", roomRoutes);

// Basic Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        error: "Something went wrong, please try again later."
    });
});

// Catch all 404 errors
app.use((req, res, next) => {
    res.status(404).send({
        error: "Route not found"
    });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
