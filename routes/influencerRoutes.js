// routes/influencerRoutes.js
const express = require("express");
const {
  fetchDetails,
  updateDetails,
  fetchAllInfluencers,
  deleteInfluencer,
} = require("../controllers/influencerController");

const router = express.Router();

// Fetch influencer details for a user
router.get("/users/:userId/details", fetchDetails);

// Update influencer details for a user
router.put("/users/:userId/details", updateDetails);

// Fetch all influencers
router.get("/influencers", fetchAllInfluencers);

// Delete an influencer
router.delete("/influencers/:influencerId", deleteInfluencer);

module.exports = router;
