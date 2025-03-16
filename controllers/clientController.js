const Client = require("../models/Client");
const Plan = require("../models/Plan");

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).send(client);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all clients
exports.getAllClients = async (req, res) => {
  let id = req.params;
  try {
    const clients = await Client.find().populate("plan_id");
    res.status(200).send(clients);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate("user_id")
      .populate("plan_id");
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }
    res.status(200).send(client);
  } catch (error) {
    console.log(error);

    res.status(500).send(error);
  }
};

// Update a client by ID
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }
    res.status(200).send(client);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a client by ID
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }
    res.status(200).send({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};
