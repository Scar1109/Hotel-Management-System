const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

const dbConfig = require("./db");

app.use(express.json());

app.options('*', cors());

const port = process.env.PORT || 5000;

app.listen(port, () =>
    console.log(`Server running on port ${port} with nodemon`)
);
