const mongoose = require("mongoose");

const stageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  substages: [
    {
      name: {
        type: String, // Substage name
        required: true,
        trim: true,
      },
      selected: {
        type: Boolean, // Substage selection status
        default: false, // Default to false (not selected)
      },
    },
  ],
  selected: {
    type: Boolean, // Stage status (true = available, false = not available)
    default: false, // Default to false (not available)
  },
});

const deliverableSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  stages: [stageSchema], // Array of stages
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Deliverable", deliverableSchema);
