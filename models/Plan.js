const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  plan_name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  deliverables: [
    {
      type: {
        type: String, // Directly store the deliverable type
        required: true,
        trim: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure quantity is at least 1
      },
      stages: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          selected: {
            type: Boolean,
            default: false, // Default to false (not selected)
          },
          substages: [
            {
              name: {
                type: String,
                required: true,
                trim: true,
              },
              selected: {
                type: Boolean,
                default: false, // Default to false (not selected)
              },
            },
          ],
        },
      ],
    },
  ],
  frequency: {
    type: String,
    required: true,
    enum: ["monthly", "quarterly", "yearly", "one-time"],
    default: "monthly",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Client collection
    ref: "Client", // Name of the Client model
    required: true, // Assuming every plan must be associated with a client
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Plan", planSchema);
