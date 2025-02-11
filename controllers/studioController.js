const studioService = require("../services/studioService");

exports.registerStudio = async (req, res) => {
  try {
    const studio = await studioService.createStudio(req.body);
    res.status(201).json({ message: "Studio registered successfully", studio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStudio = async (req, res) => {
  try {
    const studio = await studioService.getStudioById(req.params.id);
    if (!studio) return res.status(404).json({ error: "Studio not found" });
    res.json(studio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudio = async (req, res) => {
  try {
    const studio = await studioService.updateStudio(req.params.id, req.body);
    if (!studio) return res.status(404).json({ error: "Studio not found" });
    res.json({ message: "Studio updated successfully", studio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStudio = async (req, res) => {
  try {
    const studio = await studioService.deleteStudio(req.params.id);
    if (!studio) return res.status(404).json({ error: "Studio not found" });
    res.json({ message: "Studio deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStudios = async (req, res) => {
  try {
    const studios = await studioService.getAllStudios();
    res.json(studios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
