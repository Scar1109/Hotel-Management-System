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

// Middleware
app.use(cors()); // Apply CORS middleware here
app.use(express.json()); // Parse JSON bodies

// Route Definitions
app.use("/api/catering", cateringRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/room", roomRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
