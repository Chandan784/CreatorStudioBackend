const mongoose = require("mongoose");
const Plan = require("./Plan");
const User = require("./User");

const clientSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan", // Reference to the Plan collection
  },
  description: {
    type: String,
    trim: true,
    default: "", // Optional field with a default empty string
  },
  manager: {
    type: String,
    trim: true,
    default: "", // Optional field with a default empty string
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the `updated_at` field before saving

module.exports = mongoose.model("Client", clientSchema);
