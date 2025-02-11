const mongoose = require("mongoose");

const StudioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  equipment: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }], // Example of related data
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Studio", StudioSchema);
