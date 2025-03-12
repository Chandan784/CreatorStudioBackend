const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  interestLevel: {
    type: String,
    enum: ["high", "medium", "low"], // Interest level of the lead
    default: "medium",
  },
  proposalStatus: {
    type: String,
    enum: ["pending", "sent", "accepted", "rejected"], // Status of the proposal
    default: "pending",
  },
  callStatus: {
    type: String,
    enum: ["not contacted", "contacted", "in progress", "completed"], // Status of the call
    default: "not contacted",
  },
  callbackRequired: {
    type: Boolean,
    default: false, // Whether a callback is required
  },
  dateOfFollowUp: {
    type: Date, // Date for the next follow-up
  },
  remarks: {
    type: String, // Additional remarks or notes
  },
  pointOfContact: {
    name: { type: String }, // Name of the point of contact
    email: { type: String }, // Email of the point of contact
    phone: { type: String }, // Phone number of the point of contact
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for when the lead was created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp for when the lead was last updated
  },
});

module.exports = mongoose.model("Lead", leadSchema);
