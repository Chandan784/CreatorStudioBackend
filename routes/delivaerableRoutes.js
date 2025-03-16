const express = require("express");
const router = express.Router();
const deliverableController = require("../controllers/deliverableController");

// Deliverable routes
router.post("/", deliverableController.createDeliverable);
router.get("/", deliverableController.getAllDeliverables);
router.get("/:id", deliverableController.getDeliverableById);
router.put("/:id", deliverableController.updateDeliverable);
router.delete("/:id", deliverableController.deleteDeliverable);

module.exports = router;
