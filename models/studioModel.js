const mongoose = require("mongoose");

// Define the Studio Schema
const studioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  landmark: { type: String },
  location: { type: String, required: true },
  city: { type: String, required: true },
  area: { type: String, required: true },
  pincode: { type: String, required: true },
  facilities: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs or file paths
  equipment: [
    {
      category: { type: String, required: true },
      subcategory: { type: String, required: true },
      model: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }, // URL or file path
      questions: {
        type: Map, // Use a Map to store dynamic questions and answers
        of: String, // Answers are strings
      },
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

// Create the Studio Model
const Studio = mongoose.model("Studio", studioSchema);

module.exports = Studio;
