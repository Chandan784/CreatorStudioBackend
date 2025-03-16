// models/Influencer.js
const mongoose = require("mongoose");

const influencerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Ensure one influencer record per user
  },
  niche: {
    type: String,
    default: "",
  },
  platforms: {
    type: String,
    default: "",
  },
  followers: {
    type: String,
    default: "",
  },
  goal: {
    type: String,
    default: "",
  },
  challenges: {
    type: [String],
    default: [],
  },
  services: {
    type: [String],
    default: [],
  },
  budget: {
    type: String,
    default: "",
  },
  agencySizePreference: {
    type: String,
    default: "",
  },
  timeline: {
    type: String,
    default: "",
  },
  accountManager: {
    type: Boolean,
    default: false,
  },
  consultationCall: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Influencer", influencerSchema);
