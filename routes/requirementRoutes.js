const express = require("express");
const {
  saveOrUpdateRequirement,
  getRequirement,
} = require("../controllers/requirementController");

const router = express.Router();

// Save or update requirement for a user
router.put("/users/:userId/requirements", saveOrUpdateRequirement);

// Get requirement for a user
router.get("/users/:userId/requirements", getRequirement);

module.exports = router;
