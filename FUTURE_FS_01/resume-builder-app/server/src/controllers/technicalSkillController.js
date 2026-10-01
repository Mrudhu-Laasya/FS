const { response } = require("express");
const TechnicalSkills = require("../models/TechnicalSkills");

const getTechnicalSkills = async (req, res) => {
  try {
    const technicalSkillsResponse = await TechnicalSkills.find();
    res.json(technicalSkillsResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createTechnicalSkill = async (req, res) => {
  try {
    const createTechnicalSkillResponse = await TechnicalSkills.create(req.body);
    res.json(createTechnicalSkillResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTechnicalSkill = async (req, res) => {
  try {
    const updateTechnicalSkillResponse =
      await TechnicalSkills.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { returnDocument: "after" },
      );
    res.status(201).json(updateTechnicalSkillResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTechnicalSkill = async (req, res) => {
  try {
    const deleteTechnicalSkillResponse =
      await TechnicalSkills.findByIdAndDelete(req.params.id);
    if (!deleteTechnicalSkillResponse) {
      return res.status(404).json({
        message: "Technical Skill not found",
      });
    }
    res.status(200).json({
      message: "Technical Skill deleted successfully",
      technicalSkill: deleteTechnicalSkillResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTechnicalSkills,
  createTechnicalSkill,
  deleteTechnicalSkill,
  updateTechnicalSkill,
};
