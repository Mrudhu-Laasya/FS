const { response } = require("express");
const Achievements = require("../models/Achievements");

const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievements.find();
    res.json(achievements);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createAchievement = async (req, res) => {
  try {
    const createAchievementResponse = await Achievements.create(req.body);
    res.json(createAchievementResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const updateAchievementResponse = await Achievements.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" },
    );
    res.status(201).json(updateAchievementResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const deleteAchievementResponse = await Achievements.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteAchievementResponse) {
      return res.status(404).json({
        message: "Achievement not found",
      });
    }

    res.status(200).json({
      message: "Achievement deleted successfully",
      achievement: deleteAchievementResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
