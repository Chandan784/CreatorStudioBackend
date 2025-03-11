const mongoose = require("mongoose");
const User = require("../models/User");
const AgencyRequirement = require("../models/AgencyRequirement");
const BusinessRequirement = require("../models/BusinessRequirement");
const InfluencerRequirement = require("../models/InfluencerRequirement");

// Save requirement based on user role
const saveOrUpdateRequirement = async (req, res) => {
  const { userId } = req.params;
  const requirementData = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error("User not found");
    }

    let requirement;
    let requirementType;

    switch (user.role) {
      case "Agency":
        requirementType = "AgencyRequirement";
        if (user.requirement) {
          requirement = await AgencyRequirement.findByIdAndUpdate(
            user.requirement,
            requirementData,
            { new: true, session }
          );
        } else {
          requirement = new AgencyRequirement(requirementData);
          await requirement.save({ session });
        }
        break;
      case "Business":
        requirementType = "BusinessRequirement";
        if (user.requirement) {
          requirement = await BusinessRequirement.findByIdAndUpdate(
            user.requirement,
            requirementData,
            { new: true, session }
          );
        } else {
          requirement = new BusinessRequirement(requirementData);
          await requirement.save({ session });
        }
        break;
      case "Influencer":
        requirementType = "InfluencerRequirement";
        if (user.requirement) {
          requirement = await InfluencerRequirement.findByIdAndUpdate(
            user.requirement,
            requirementData,
            { new: true, session }
          );
        } else {
          requirement = new InfluencerRequirement(requirementData);
          await requirement.save({ session });
        }
        break;
      default:
        throw new Error("Invalid user role");
    }

    if (!requirement) {
      throw new Error("Requirement not found or could not be created");
    }

    user.requirement = requirement._id;
    user.requirementType = requirementType;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Requirement saved or updated successfully",
      data: requirement,
    });
  } catch (error) {
    console.log(error);

    await session.abortTransaction();
    session.endSession();
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update requirement based on user role

// Get requirement based on user role
const getRequirement = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      throw new Error("User not found");
    }

    let requirement;

    switch (user.role) {
      case "Agency":
        requirement = await AgencyRequirement.findById(user.requirement);
        break;
      case "Business":
        requirement = await BusinessRequirement.findById(user.requirement);
        break;
      case "Influencer":
        requirement = await InfluencerRequirement.findById(user.requirement);
        break;
      default:
        throw new Error("Invalid user role");
    }

    if (!requirement) {
      throw new Error("Requirement not found");
    }

    res.status(200).json({
      success: true,
      message: "Requirement retrieved successfully",
      data: requirement,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { saveOrUpdateRequirement, getRequirement };
