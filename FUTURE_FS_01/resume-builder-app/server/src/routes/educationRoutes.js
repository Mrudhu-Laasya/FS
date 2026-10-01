const express = require("express");
const router = express.Router();

const {
  getEducation,
  createEducation,
  deleteEducation,
  updateEducation,
} = require("../controllers/educationController");

router.get("/", getEducation);
router.post("/", createEducation);
router.patch("/:id", updateEducation);
router.delete("/:id", deleteEducation);

module.exports = router;
