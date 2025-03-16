const Deliverable = require("../models/Deliverable");

// Create a new deliverable
exports.createDeliverable = async (req, res) => {
  try {
    const deliverable = new Deliverable(req.body);
    await deliverable.save();
    res.status(201).send(deliverable);
  } catch (error) {
    console.log(error);

    res.status(400).send(error);
  }
};

// Get all deliverables
exports.getAllDeliverables = async (req, res) => {
  try {
    const deliverables = await Deliverable.find();
    res.status(200).send(deliverables);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a deliverable by ID
exports.getDeliverableById = async (req, res) => {
  try {
    const deliverable = await Deliverable.findById(req.params.id);
    if (!deliverable) {
      return res.status(404).send({ message: "Deliverable not found" });
    }
    res.status(200).send(deliverable);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a deliverable by ID
exports.updateDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!deliverable) {
      return res.status(404).send({ message: "Deliverable not found" });
    }
    res.status(200).send(deliverable);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a deliverable by ID
exports.deleteDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findByIdAndDelete(req.params.id);
    if (!deliverable) {
      return res.status(404).send({ message: "Deliverable not found" });
    }
    res.status(200).send({ message: "Deliverable deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};
