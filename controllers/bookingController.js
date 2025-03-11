const Booking = require("../models/Booking");
const Availability = require("../models/Availability");

// 📌 Create a booking
const createBooking = async (req, res) => {
  try {
    const { studioId, userId, date, timeSlots } = req.body;

    // Check if all slots are available
    const availability = await Availability.findOne({ studioId, date });
    if (!availability) {
      return res
        .status(400)
        .json({ success: false, message: "No availability for this date" });
    }

    for (const timeSlot of timeSlots) {
      const slotIndex = availability.slots.findIndex(
        (slot) =>
          slot.startTime === timeSlot.startTime &&
          slot.endTime === timeSlot.endTime
      );

      if (slotIndex === -1 || availability.slots[slotIndex].booked) {
        return res.status(400).json({
          success: false,
          message: "One or more slots are already booked",
        });
      }
    }

    // Mark all slots as booked
    // for (const timeSlot of timeSlots) {
    //   const slotIndex = availability.slots.findIndex(
    //     (slot) =>
    //       slot.startTime === timeSlot.startTime &&
    //       slot.endTime === timeSlot.endTime
    //   );
    //   availability.slots[slotIndex].booked = true;
    // }
    // await availability.save();

    // Create a new booking with multiple slots
    const booking = new Booking({ studioId, userId, date, timeSlots });
    await booking.save();

    res
      .status(201)
      .json({ success: true, message: "Booking successful", booking });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Get all bookings (Admin/Studio Owner)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("studioId userId");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Get bookings for a specific user
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).populate("studioId");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Get bookings for a specific studio
const getStudioBookings = async (req, res) => {
  try {
    const { studioId } = req.params;
    const bookings = await Booking.find({ studioId }).populate("userId");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Update booking status (Approve/Reject)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res
      .status(200)
      .json({ success: true, message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Cancel a booking (User cancels)
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Free up all the slots in availability
    const availability = await Availability.findOne({
      studioId: booking.studioId,
      date: booking.date,
    });
    if (availability) {
      for (const timeSlot of booking.timeSlots) {
        const slotIndex = availability.slots.findIndex(
          (slot) =>
            slot.startTime === timeSlot.startTime &&
            slot.endTime === timeSlot.endTime
        );
        if (slotIndex !== -1) {
          availability.slots[slotIndex].booked = false;
        }
      }
      await availability.save();
    }

    await booking.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 Delete a booking (Admin/Studio Owner)
const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    await booking.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getStudioBookings,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
};
