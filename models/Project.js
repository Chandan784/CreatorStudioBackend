const mongoose = require("mongoose");

const stageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"], // Stage status
    default: "Not Started",
  },
  drive_link: {
    type: String, // Google Drive link or any other file storage link
    trim: true,
  },
  assigned: {
    type: String, // Assigned team member or role (as a string)
    trim: true,
  },
});

const projectSchema = new mongoose.Schema({
  plan_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Plan collection
    ref: "Plan", // Name of the Plan model
    required: true,
  },
  project_name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  starting_date: {
    type: Date,
    required: true,
  },
  ending_date: {
    type: Date,
    required: true,
  },
  stages: [stageSchema], // Array of stages with status, drive link, and assigned
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
