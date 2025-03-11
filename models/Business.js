const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  industry: {
    type: String,
    required: true,
    trim: true,
  },
  businessSize: {
    type: String,
    enum: ["Small", "Medium", "Large"],
    required: true,
  },
  targetAudience: {
    ageRange: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    location: {
      type: String,
      trim: true,
    },
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  marketingGoals: [
    {
      type: String,
      trim: true,
    },
  ],
  currentStrategies: [
    {
      type: String,
      trim: true,
    },
  ],
  challenges: [
    {
      type: String,
      trim: true,
    },
  ],
  services: [
    {
      type: String,
      trim: true,
    },
  ],
  budget: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  agencySizePreference: {
    type: String,
    enum: ["Small", "Medium", "Large"],
    required: true,
  },
  timeline: {
    type: String,
    enum: ["Short-Term", "Long-Term"],
    required: true,
  },
  accountManager: {
    type: Boolean,
    default: false,
  },
  consultationCall: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
