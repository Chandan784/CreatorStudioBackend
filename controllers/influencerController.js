// controllers/influencerController.js
const User = require("../models/User");
const Influencer = require("../models/Influencer");
const Lead = require("../models/Lead");

// Fetch influencer details for a user
const fetchDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and populate the 'details' field
    const user = await User.findById(userId).populate("details");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has influencer details
    if (!user.details) {
      return res.status(404).json({ message: "Influencer details not found" });
    }

    res.status(200).json({ data: user.details });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ message: "Failed to fetch details" });
  }
};

// Update influencer details for a user and create/update a lead
const updateDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedDetails = req.body;

    // Find the user
    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an influencer
    if (user.role !== "Influencer") {
      return res.status(400).json({ message: "User is not an influencer" });
    }

    // Update or create the influencer document
    let influencer = await Influencer.findOneAndUpdate(
      { userId },
      updatedDetails,
      { new: true, upsert: true }
    );

    // Update the user's details field with the influencer's ObjectId
    user.details = influencer._id;
    await user.save();

    // Prepare lead data
    const leadData = {
      userId: user._id,
      influencerId: influencer._id,
      interestLevel: "medium", // Default interest level
      proposalStatus: "pending", // Default proposal status
      callStatus: "not contacted", // Default call status
      callbackRequired: false, // Default callback status
      remarks: "New influencer details saved", // Default remarks
      pointOfContact: {
        name: user.name,
        email: user.email,
        phone: user.phoneNumber,
      },
    };

    // Check if a lead already exists for this influencer
    let lead = await Lead.findOne({ influencerId: influencer._id });

    if (lead) {
      // Update the existing lead
      lead = await Lead.findByIdAndUpdate(lead._id, leadData, { new: true });
    } else {
      // Create a new lead
      lead = new Lead(leadData);
      await lead.save();
    }

    res.status(200).json({ data: influencer, lead });
  } catch (error) {
    console.error("Error updating details:", error);
    res.status(500).json({ message: "Failed to update details" });
  }
};

// Fetch all influencers
const fetchAllInfluencers = async (req, res) => {
  try {
    // Fetch all influencers and populate the 'userId' field
    const influencers = await Influencer.find().populate(
      "userId",
      "name email phoneNumber"
    );

    res.status(200).json({ data: influencers });
  } catch (error) {
    console.error("Error fetching influencers:", error);
    res.status(500).json({ message: "Failed to fetch influencers" });
  }
};

// Delete an influencer and associated lead
const deleteInfluencer = async (req, res) => {
  try {
    const { influencerId } = req.params;

    // Find the influencer
    const influencer = await Influencer.findById(influencerId);

    if (!influencer) {
      return res.status(404).json({ message: "Influencer not found" });
    }

    // Find the user and remove the reference to the influencer
    const user = await User.findById(influencer.userId);

    if (user) {
      user.details = null; // Remove the reference
      await user.save();
    }

    // Delete the influencer document
    await Influencer.findByIdAndDelete(influencerId);

    // Delete the associated lead
    await Lead.findOneAndDelete({ influencerId });

    res
      .status(200)
      .json({ message: "Influencer and associated lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting influencer:", error);
    res.status(500).json({ message: "Failed to delete influencer" });
  }
};

module.exports = {
  fetchDetails,
  updateDetails,
  fetchAllInfluencers,
  deleteInfluencer,
};
