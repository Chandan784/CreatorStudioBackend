const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Create a Project
router.post("/", projectController.createProject);

// Get All Projects
router.get("/", projectController.getAllProjects);

// Get All Projects by Plan ID
router.get("/:planId/projects", projectController.getProjectsByPlanId);

// Get a Single Project by ID
router.get("/:id", projectController.getProjectById);

// Update a Project
router.put("/:id", projectController.updateProject);

// Delete a Project
router.delete("/:id", projectController.deleteProject);

module.exports = router;
