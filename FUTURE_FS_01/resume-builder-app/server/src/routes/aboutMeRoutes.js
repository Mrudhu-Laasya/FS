const express = require("express");
const router = express.Router();

const {
  getAboutMe,
  updateAboutMe,
} = require("../controllers/aboutMeController");

router.get("/", getAboutMe);
router.patch("/:id", updateAboutMe);

module.exports = router;
