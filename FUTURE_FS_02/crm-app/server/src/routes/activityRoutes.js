const express = require("express");
const router = express.Router();

const {
  createActivity,
  getAllActivities,
  getActivitiesByLead,
  getActivityById,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

const { protect } = require("../middleware/authMiddleware");

// All activity routes require authentication
router.use(protect);

// CREATE activity
router.post("/", createActivity);

// READ all activities
router.get("/", getAllActivities);

// READ activities belonging to one lead
router.get("/lead/:leadId", getActivitiesByLead);

// READ one activity
router.get("/:id", getActivityById);

// UPDATE activity description
router.put("/:id", updateActivity);

// DELETE activity
router.delete("/:id", deleteActivity);

module.exports = router;
