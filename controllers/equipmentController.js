const Equipment = require("../models/Equipment");

// Create a new equipment
exports.createEquipment = async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();
    res.status(201).json({ success: true, data: equipment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.status(200).json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a single equipment by ID
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, error: "Equipment not found" });
    }
    res.status(200).json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an equipment by ID
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, error: "Equipment not found" });
    }
    res.status(200).json({ success: true, data: equipment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete an equipment by ID
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, error: "Equipment not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
