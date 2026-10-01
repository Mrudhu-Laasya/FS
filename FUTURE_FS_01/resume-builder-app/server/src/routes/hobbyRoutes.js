const express = require("express");
const router = express.Router();

const {
  getHobbies,
  createHobby,
  deleteHobby,
  updateHobby,
} = require("../controllers/hobbyController");

router.get("/", getHobbies);
router.post("/", createHobby);
router.patch("/:id", updateHobby);
router.delete("/:id", deleteHobby);

module.exports = router;
