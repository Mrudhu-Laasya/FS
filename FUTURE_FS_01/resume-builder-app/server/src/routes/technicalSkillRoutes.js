const express = require("express");
const router = express.Router();
const {
  getTechnicalSkills,
  createTechnicalSkill,
  deleteTechnicalSkill,
  updateTechnicalSkill,
} = require("../controllers/technicalSkillController");
router.get("/", getTechnicalSkills);
router.post("/", createTechnicalSkill);
router.patch("/:id", updateTechnicalSkill);
router.delete("/:id", deleteTechnicalSkill);

module.exports = router;
