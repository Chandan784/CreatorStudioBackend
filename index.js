require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const studioRoutes = require("./routes/studioRoute");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow requests from any origin (for development)
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Connect Database
connectDB();

// Routes
app.use("/api/v1/studio", studioRoutes); // Studio routes
app.use("/api/v1/auth", authRoutes); // Auth routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
