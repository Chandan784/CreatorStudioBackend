const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");

// Plan routes
router.post("/", planController.createPlan);
router.get("/", planController.getAllPlans);
router.get("/:id", planController.getPlanById);
router.put("/:id", planController.updatePlan);
router.delete("/:id", planController.deletePlan);
router.get("/user/:userId", planController.getPlansByUserId);

module.exports = router;
