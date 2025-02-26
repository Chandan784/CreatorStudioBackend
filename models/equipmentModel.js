const mongoose = require("mongoose");

// Define the Equipment Schema
const equipmentSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  model: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }, // URL or file path
  questions: {
    type: Map, // Use a Map to store dynamic questions and answers
    of: String, // Answers are strings
  },
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

// Create the Equipment Model
const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
