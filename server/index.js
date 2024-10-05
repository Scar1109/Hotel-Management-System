const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors");
const cron = require("node-cron"); // Schedule tasks (cron jobs)
const { sendReminderEmail } = require('./utils/emailService'); // Email sending service
const Reminder = require('./models/reminder'); // Reminder model
const Event = require('./models/Event'); // Event model
const User = require('./models/User'); // User model (Ensure this is added)

const app = express();

// Database configuration
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
const reminderRoutes = require('./routes/reminderRoutes');

// Middleware
app.use(cors());
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
app.use("/api/reminder", reminderRoutes);

// Cron job to check reminders every hour
cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();
        const reminders = await Reminder.find({
            reminderTime: { $lte: now }, // Find reminders that are due
            sentStatus: false // Only process reminders that haven't been sent yet
        });

        for (const reminder of reminders) {
            const event = await Event.findOne({ eventId: reminder.eventId });
            const user = await User.findOne({ userID: reminder.userId }); // Find user by userID

            if (event && user) {
                // Send reminder email to the user
                await sendReminderEmail(user.email, event);

                // Mark reminder as sent
                reminder.sentStatus = true;
                await reminder.save();

                console.log(`Email sent to ${user.email} for event ${event.eventName}`);
            } else {
                console.error(`User or event not found for reminder: ${reminder._id}`);
            }
        }
    } catch (error) {
        console.error('Error sending reminders:', error);
    }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
