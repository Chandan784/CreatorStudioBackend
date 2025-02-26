const express = require("express");
const equipmentController = require("../controllers/equipmentController");

const router = express.Router();

// Create a new equipment
router.post("/equipment", equipmentController.createEquipment);

// Get all equipment
router.get("/equipment", equipmentController.getAllEquipment);

// Get a single equipment by ID
router.get("/equipment/:id", equipmentController.getEquipmentById);

// Update an equipment by ID
router.put("/equipment/:id", equipmentController.updateEquipment);

// Delete an equipment by ID
router.delete("/equipment/:id", equipmentController.deleteEquipment);

module.exports = router;
