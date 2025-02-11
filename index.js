require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const studioRoutes = require("./routes/studioRoute");

const app = express();
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/studio", studioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
