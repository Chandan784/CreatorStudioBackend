const Availability = require("../models/Availability");

// Create or Update Availability
const updateAvailability = async (req, res) => {
  try {
    const { studioId, date, slots, startHour, endHour, isDayOff } = req.body;

    // Validate required fields
    if (!studioId || !date || !Array.isArray(slots)) {
      return res.status(400).json({
        success: false,
        message: "studioId, date, and slots are required",
      });
    }

    let availability = await Availability.findOne({ studioId, date });

    if (!availability) {
      // If no availability exists, create a new one
      availability = new Availability({
        studioId,
        date,
        slots,
        startHour,
        endHour,
        isDayOff,
      });
    } else {
      // Prevent updating booked slots
      const bookedSlots = availability.slots.filter((slot) => slot.booked);
      const conflict = slots.some((slot) =>
        bookedSlots.some(
          (booked) =>
            booked.startTime === slot.startTime &&
            booked.endTime === slot.endTime
        )
      );

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: "Cannot update booked slots",
        });
      }

      // Update availability fields
      availability.slots = slots;
      availability.startHour = startHour;
      availability.endHour = endHour;
      availability.isDayOff = isDayOff;
    }

    await availability.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      availability,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Availability for a Studio on a Specific Date
const getAvailability = async (req, res) => {
  try {
    const { studioId, date } = req.params;
    const availability = await Availability.findOne({ studioId, date });

    if (!availability) {
      return res.status(200).json({
        success: false,
        message: "No availability found for this date",
      });
    }
    function getDayFromDate(dateString) {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const date = new Date(dateString);
      return days[date.getDay()]; // Returns the day name (e.g., "Tuesday")
    }
    const day = getDayFromDate(availability.date);

    let dayData = {
      day, // Derived from the date
      startHour: availability.startHour,
      endHour: availability.endHour,
      isDayOff: availability.isDayOff,
      slots: availability.slots,
    };

    res.status(200).json({ success: true, dayData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { updateAvailability, getAvailability };
