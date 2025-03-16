const Plan = require("../models/Plan");
const Project = require("../models/Project");
const Client = require("../models/Client");

// Create a new plan and automatically create projects
exports.createPlan = async (req, res) => {
  try {
    // Save the plan
    const plan = new Plan(req.body);
    await plan.save();

    // Create projects based on deliverables' quantity
    for (const deliverable of plan.deliverables) {
      for (let i = 0; i < deliverable.quantity; i++) {
        // Create a new project with default values
        const newProject = {
          plan_id: plan._id, // Reference to the newly created plan
          project_name: `${deliverable.type} Project ${i + 1}`, // Unique project name
          description: `Default project for ${deliverable.type}`,
          starting_date: new Date(), // Default starting date
          ending_date: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default ending date (1 month later)
          stages: deliverable.stages.map((stage) => ({
            name: stage.name,
            status: "Not Started", // Default status
            drive_link: "", // Default drive link
            assigned: "", // Default assigned value
          })),
        };

        // Save the project
        const project = new Project(newProject);
        await project.save();
      }
    }

    res.status(201).send(plan);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ message: "Error creating plan", error: error.message });
  }
};

// Get all plans
exports.getAllPlans = async (req, res) => {
  try {
    // Fetch all plans and populate only the valid paths (e.g., client_id)
    const plans = await Plan.find().populate("client_id");

    // Send the plans as a response
    res.status(200).send(plans);
  } catch (error) {
    // Handle errors
    res
      .status(500)
      .send({ message: "Error fetching plans", error: error.message });
  }
};

// Get a plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate("deliverables")
      .populate("client_id");
    if (!plan) {
      return res.status(404).send({ message: "Plan not found" });
    }
    res.status(200).send(plan);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching plan", error: error.message });
  }
};

// Update a plan by ID
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("deliverables")
      .populate("client_id");

    if (!plan) {
      return res.status(404).send({ message: "Plan not found" });
    }
    res.status(200).send(plan);
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error updating plan", error: error.message });
  }
};

// Delete a plan by ID
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).send({ message: "Plan not found" });
    }
    res.status(200).send({ message: "Plan deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting plan", error: error.message });
  }
};

// Fetch all plans for a client where the client is linked to a specific user (via user_id)
exports.getPlansByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    // Step 1: Find the client(s) associated with the given user_id
    const clients = await Client.find({ user_id: userId });

    if (clients.length === 0) {
      return res
        .status(404)
        .send({ message: "No clients found for the given user ID." });
    }

    // Step 2: Extract client IDs
    const clientIds = clients.map((client) => client._id);
    console.log(clientIds);

    // Step 3: Fetch all plans associated with the client IDs
    const plans = await Plan.find({ client_id: { $in: clientIds } })
      .populate({
        path: "client_id", // Populate the client details
        populate: {
          path: "user_id", // Populate the user details within the client
          select: "name email", // Select specific fields from the User model
        },
      })
      .exec();

    res.status(200).send(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res
      .status(500)
      .send({ message: "Error fetching plans", error: error.message });
  }
};
