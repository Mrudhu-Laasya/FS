const Activity = require("../models/Activity");
const Lead = require("../models/Lead");

// CREATE an activity
const createActivity = async (req, res) => {
  try {
    const { lead, action, description, previousStatus, newStatus } = req.body;

    if (!lead || !action || !description) {
      return res.status(400).json({
        message: "Lead, action, and description are required",
      });
    }

    const existingLead = await Lead.findById(lead);

    if (!existingLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const activity = await Activity.create({
      lead,
      admin: req.admin?._id || null,
      action,
      description,
      previousStatus,
      newStatus,
    });

    res.status(201).json({
      message: "Activity created successfully",
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all activities
const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("lead", "name email status")
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ activities for one lead
const getActivitiesByLead = async (req, res) => {
  try {
    const activities = await Activity.find({
      lead: req.params.leadId,
    })
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ one activity
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate("lead", "name email status")
      .populate("admin", "name email");

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE activity description
const updateActivity = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({
        message: "Activity description is required",
      });
    }

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: { description: description.trim() } },
      { new: true, runValidators: true },
    );

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({
      message: "Activity updated successfully",
      activity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE activity
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createActivity,
  getAllActivities,
  getActivitiesByLead,
  getActivityById,
  updateActivity,
  deleteActivity,
};
