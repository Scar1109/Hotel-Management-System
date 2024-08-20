const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

const dbConfig = require("./config/db");

const cateringRoutes = require("./routes/cateringRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const eventRoutes = require("./routes/eventRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const orderRoutes = require("./routes/orderRoutes");
const packageRoutes = require("./routes/packageRoutes");
const parkingRoutes = require("./routes/parkingRoute");
const userRoutes = require("./routes/userRoute");
const roomRoutes = require("./routes/roomRoutes");


app.use(express.json());

app.use("/api/catering", cateringRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/room", roomRoutes);


app.options('*', cors());

const port = process.env.PORT || 5000;

app.listen(port, () =>
    console.log(`Server running on port ${port} with nodemon`)
);
