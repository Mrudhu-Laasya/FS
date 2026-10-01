const express = require("express");
const router = express.Router();
const {
  getSoftSkills,
  createSoftSkill,
  deleteSoftSkill,
  updateSoftSkill,
} = require("../controllers/softSkillController");
router.get("/", getSoftSkills);
router.post("/", createSoftSkill);
router.patch("/:id", updateSoftSkill);
router.delete("/:id", deleteSoftSkill);

module.exports = router;
