require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const connectDB = require("./config/db");
const studioRoutes = require("./routes/studioRoute");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const requirementRoutes = require("./routes/requirementRoutes");
const leadRoutes = require("./routes/leadRoutes");
const InfluencerRoutes = require("./routes/influencerRoutes");
const clinetRoutes = require("./routes/clientRoutes");
const planRoutes = require("./routes/planRoutes");
const deliverableRoutes = require("./routes/delivaerableRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Setup (corrected)
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true,
  })
);

// ✅ Session Middleware
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Change to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
  })
);

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use("/api/v1/studio", studioRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/availability", availabilityRoutes);
app.use("/api/v1/requirements", requirementRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/influencer", InfluencerRoutes);
app.use("/api/v1/clients", clinetRoutes);
app.use("/api/v1/plans", planRoutes);
app.use("/api/v1/deliverables", deliverableRoutes);
app.use("/api/v1/projects", projectRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
