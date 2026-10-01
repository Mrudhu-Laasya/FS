const { response } = require("express");
const SoftSkills = require("../models/SoftSkills");

const getSoftSkills = async (req, res) => {
  try {
    const softSkillsResponse = await SoftSkills.find();
    res.json(softSkillsResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createSoftSkill = async (req, res) => {
  try {
    const createSoftSkillResponse = await SoftSkills.create(req.body);
    res.json(createSoftSkillResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateSoftSkill = async (req, res) => {
  try {
    const updateSoftSkillResponse = await SoftSkills.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" },
    );
    res.status(201).json(updateSoftSkillResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteSoftSkill = async (req, res) => {
  try {
    const deleteSoftSkillResponse = await SoftSkills.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteSoftSkillResponse) {
      return res.status(404).json({
        message: "Soft Skill not found",
      });
    }
    res.status(200).json({
      message: "Soft Skill deleted successfully",
      softSkill: deleteSoftSkillResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSoftSkills,
  createSoftSkill,
  deleteSoftSkill,
  updateSoftSkill,
};
