const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true }, // HH:mm
  booked: { type: Boolean, default: false }, // ✅ Marks if a user booked the slot
  enabled: { type: Boolean, default: true }, // ✅ Studio can disable a slot
});

const availabilitySchema = new mongoose.Schema({
  studioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Studio",
    required: true,
  },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  startHour: { type: Number, required: true }, // Start hour (e.g., 9)
  endHour: { type: Number, required: true }, // End hour (e.g., 17)
  isDayOff: { type: Boolean, default: false }, // ✅ Indicates if the entire day is off
  slots: [slotSchema], // Array of slots for the day
});

module.exports = mongoose.model("Availability", availabilitySchema);
