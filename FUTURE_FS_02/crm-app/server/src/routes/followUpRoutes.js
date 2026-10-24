const express = require("express");
const router = express.Router();

const {
  createFollowup,
  markCompletion,
  getFollowups,
  rescheduleFollowup,
} = require("../controllers/followUpController");

const { protect } = require("../middleware/authMiddleware");

// Get follow-ups grouped by category
router.get("/", protect, getFollowups);

// Create a follow-up
router.post("/", protect, createFollowup);

// Mark a follow-up as completed
router.patch("/:id/complete", protect, markCompletion);

// Reschedule a pending follow-up
router.patch("/:id/reschedule", protect, rescheduleFollowup);

module.exports = router;
