const express = require("express");
const {
  createStudio,
  getAllStudios,
  getStudioById,
  updateStudio,
  deleteStudio,
} = require("../controllers/studioController");

const router = express.Router();

// Create a new studio
router.post("/", createStudio);

// Get all studios
router.get("/", getAllStudios);

// Get a single studio by ID
router.get("/:id", getStudioById);

// Update a studio by ID
router.put("/:id", updateStudio);

// Delete a studio by ID
router.delete("/:id", deleteStudio);

module.exports = router;
