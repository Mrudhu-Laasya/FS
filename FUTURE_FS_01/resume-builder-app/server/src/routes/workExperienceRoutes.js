const express = require("express");
const router = express.Router();
const {
  getWorkExperience,
  createWorkExperience,
  deleteWorkExperience,
  updateWorkExperience,
  updateRole,
  deleteRole,
} = require("../controllers/workExperienceController");
router.get("/", getWorkExperience);
router.post("/", createWorkExperience);
router.patch("/:id", updateWorkExperience);
router.delete("/:id", deleteWorkExperience);
router.patch("/:workExperienceId/roles/:roleIndex", updateRole);
router.delete("/:workExperienceId/roles/:roleIndex", deleteRole);

module.exports = router;
