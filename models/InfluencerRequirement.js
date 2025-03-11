const mongoose = require("mongoose");

const influencerRequirementSchema = new mongoose.Schema({
  niche: String,
  platforms: String,
  followers: String,
  goal: String,
  budget: String,
  agencySizePreference: String,
  timeline: String,
});

const InfluencerRequirement = mongoose.model(
  "InfluencerRequirement",
  influencerRequirementSchema
);

module.exports = InfluencerRequirement;
