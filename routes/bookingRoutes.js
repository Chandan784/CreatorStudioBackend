const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  getStudioBookings,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
} = require("../controllers/bookingController");

// Create a booking
router.post("/", createBooking);

// Get all bookings (Admin/Studio Owner)
router.get("/", getAllBookings);

// Get bookings for a specific user
router.get("/user/:userId", getUserBookings);

// Get bookings for a specific studio
router.get("/studio/:studioId", getStudioBookings);

// Update booking status (Approve/Reject)
router.put("/:bookingId/status", updateBookingStatus);

// Cancel a booking
router.delete("/:bookingId/cancel", cancelBooking);

// Delete a booking (Admin/Studio Owner)
router.delete("/:bookingId", deleteBooking);

module.exports = router;
