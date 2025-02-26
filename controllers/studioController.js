const Studio = require("../models/studioModel");

// Create a new studio
const createStudio = async (req, res) => {
  try {
    const studio = new Studio(req.body);
    await studio.save();
    res.status(201).json({ success: true, data: studio });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all studios
const getAllStudios = async (req, res) => {
  try {
    const studios = await Studio.find();
    res.status(200).json({ success: true, data: studios });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single studio by ID
const getStudioById = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) {
      return res
        .status(404)
        .json({ success: false, error: "Studio not found" });
    }
    res.status(200).json({ success: true, data: studio });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a studio by ID
const updateStudio = async (req, res) => {
  try {
    const studio = await Studio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!studio) {
      return res
        .status(404)
        .json({ success: false, error: "Studio not found" });
    }
    res.status(200).json({ success: true, data: studio });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a studio by ID
const deleteStudio = async (req, res) => {
  try {
    const studio = await Studio.findByIdAndDelete(req.params.id);
    if (!studio) {
      return res
        .status(404)
        .json({ success: false, error: "Studio not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createStudio,
  getAllStudios,
  getStudioById,
  updateStudio,
  deleteStudio,
};
