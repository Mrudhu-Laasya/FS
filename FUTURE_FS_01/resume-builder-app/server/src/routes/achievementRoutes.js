const express = require("express");
const router = express.Router();

const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} = require("../controllers/achievementController");
router.get("/", getAchievements);
router.post("/", createAchievement);
router.patch("/:id", updateAchievement);
router.delete("/:id", deleteAchievement);

module.exports = router;
