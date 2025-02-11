const express = require("express");
const router = express.Router();
const studioController = require("../controllers/studioController");

router.post("/register", studioController.registerStudio);
router.get("/:id", studioController.getStudio);
router.put("/:id", studioController.updateStudio);
router.delete("/:id", studioController.deleteStudio);
router.get("/", studioController.getAllStudios);

module.exports = router;
