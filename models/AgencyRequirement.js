const mongoose = require("mongoose");

const agencyRequirementSchema = new mongoose.Schema({
  agencyName: {
    type: String,
    required: true,
    trim: true,
  },
  agencyWebsite: {
    type: String,
    trim: true,
  },
  agencyDescription: {
    type: String,
    trim: true,
  },
  agencySize: {
    type: String,
    enum: ["Small", "Medium", "Large"],
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  languages: [
    {
      type: String,
      trim: true,
    },
  ],
  clientType: {
    type: String,
    enum: ["Business", "Influencer", "Both"],
    required: true,
  },
  marketingServices: [
    {
      type: String,
      trim: true,
    },
  ],
  budgetRange: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  industries: [
    {
      type: String,
      trim: true,
    },
  ],
  preferredClientSize: {
    type: String,
    enum: ["Small", "Medium", "Large"],
    required: true,
  },
  marketingGoals: [
    {
      type: String,
      trim: true,
    },
  ],
  shortTermProjects: {
    type: Boolean,
    default: false,
  },
  performanceBasedPricing: {
    type: Boolean,
    default: false,
  },
  dedicatedAccountManager: {
    type: Boolean,
    default: false,
  },
  initialConsultation: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const AgencyRequirement = mongoose.model(
  "AgencyRequirement",
  agencyRequirementSchema
);

module.exports = AgencyRequirement;
