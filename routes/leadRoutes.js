const express = require("express");
const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

const router = express.Router();

router.post("/", createLead); // Create a new lead
router.get("/", getAllLeads); // Get all leads
router.get("/:id", getLeadById); // Get lead by ID
router.put("/:id", updateLead); // Update lead by ID
router.delete("/:id", deleteLead); // Delete lead by ID

module.exports = router;
