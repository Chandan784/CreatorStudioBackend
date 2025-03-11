const express = require("express");
const router = express.Router();
const {
  updateAvailability,
  getAvailability,
} = require("../controllers/availabilityController");

router.post("/", updateAvailability);
router.get("/:studioId/:date", getAvailability);

module.exports = router;
