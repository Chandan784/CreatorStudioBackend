const Studio = require("../models/studioModel");

exports.createStudio = async (data) => {
  try {
    const studio = new Studio(data);
    return await studio.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getStudioById = async (id) => {
  try {
    return await Studio.findById(id).populate("equipment");
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.updateStudio = async (id, data) => {
  try {
    return await Studio.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteStudio = async (id) => {
  try {
    return await Studio.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getAllStudios = async () => {
  try {
    return await Studio.find().populate("equipment");
  } catch (error) {
    throw new Error(error.message);
  }
};
