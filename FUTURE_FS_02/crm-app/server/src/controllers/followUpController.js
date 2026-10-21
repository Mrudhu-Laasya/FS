
const FollowUp = require("../models/FollowUp");
const Lead = require("../models/Lead");
const Activity = require("../models/Activity");

// 1. Create a follow-up
const createFollowup = async (req, res) => {
  try {
    const { lead, followUpDate, followUpPurpose } = req.body;

    if (!lead || !followUpDate || !followUpPurpose?.trim()) {
      return res.status(400).json({
        message: "Lead, follow-up date, and purpose are required",
      });
    }

    const scheduledDate = new Date(followUpDate);

    if (Number.isNaN(scheduledDate.getTime())) {
      return res.status(400).json({
        message: "Invalid follow-up date",
      });
    }

    const leadExists = await Lead.findById(lead);

    if (!leadExists) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const followUp = await FollowUp.create({
      lead,
      followUpDate: scheduledDate,
      followUpPurpose: followUpPurpose.trim(),
      createdBy: req.admin?.id || req.admin?._id || null,
    });

    await Activity.create({
      lead,
      admin: req.admin?.id || req.admin?._id || null,
      action: "follow_up_scheduled",
      description: `Follow-up scheduled for ${scheduledDate.toLocaleString()}: ${followUpPurpose.trim()}`,
    });

    return res.status(201).json({
      message: "Follow-up scheduled successfully",
      followUp,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Mark a follow-up as completed
const markCompletion = async (req, res) => {
  try {
    const { outcome } = req.body;

    if (!outcome?.trim()) {
      return res.status(400).json({
        message: "Please provide the follow-up outcome",
      });
    }

    const followUp = await FollowUp.findById(req.params.id);

    if (!followUp) {
      return res.status(404).json({ message: "Follow-up not found" });
    }

    if (followUp.status !== "pending") {
      return res.status(400).json({
        message: `Cannot complete a follow-up with status "${followUp.status}"`,
      });
    }

    followUp.status = "completed";
    followUp.completedAt = new Date();
    followUp.outcome = outcome.trim();

    await followUp.save();

    await Activity.create({
      lead: followUp.lead,
      admin: req.admin?.id || req.admin?._id || null,
      action: "follow_up_completed",
      description: `Follow-up completed: ${followUp.followUpPurpose}. Outcome: ${outcome.trim()}`,
    });

    return res.status(200).json({
      message: "Follow-up marked as completed",
      followUp,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Get follow-ups grouped by category
const getFollowups = async (req, res) => {
  try {
    // Use calendar-day boundaries in the server's local timezone.
    // Ensure the server timezone matches your intended CRM timezone.
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const followUps = await FollowUp.find()
      .populate("lead", "name email company status")
      .populate("createdBy", "name email")
      .sort({ followUpDate: 1 });

    const pending = followUps.filter(
      (item) => item.status === "pending"
    );

    const overdue = pending.filter(
      (item) => item.followUpDate < startOfToday
    );

    const dueToday = pending.filter(
      (item) =>
        item.followUpDate >= startOfToday &&
        item.followUpDate < startOfTomorrow
    );

    const upcoming = pending.filter(
      (item) => item.followUpDate >= startOfTomorrow
    );

    const completed = followUps.filter(
      (item) => item.status === "completed"
    );

    const cancelled = followUps.filter(
      (item) => item.status === "cancelled"
    );

    return res.status(200).json({
      counts: {
        overdue: overdue.length,
        dueToday: dueToday.length,
        upcoming: upcoming.length,
        completed: completed.length,
        cancelled: cancelled.length,
      },
      followUps: {
        overdue,
        dueToday,
        upcoming,
        completed,
        cancelled,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const rescheduleFollowup = async (req, res) => {
  try {
    const { followUpDate } = req.body;

    if (!followUpDate) {
      return res.status(400).json({
        message: "New follow-up date is required",
      });
    }

    const newDate = new Date(followUpDate);

    if (Number.isNaN(newDate.getTime())) {
      return res.status(400).json({
        message: "Invalid follow-up date",
      });
    }

    const followUp = await FollowUp.findById(req.params.id);

    if (!followUp) {
      return res.status(404).json({
        message: "Follow-up not found",
      });
    }

    if (followUp.status !== "pending") {
      return res.status(400).json({
        message: "Only pending follow-ups can be rescheduled",
      });
    }

    const previousDate = followUp.followUpDate;

    followUp.followUpDate = newDate;
    await followUp.save();

    await Activity.create({
      lead: followUp.lead,
      admin: req.admin?.id || req.admin?._id || null,
      action: "follow_up_rescheduled",
      description: `Follow-up "${followUp.followUpPurpose}" rescheduled from ${previousDate.toLocaleString()} to ${newDate.toLocaleString()}`,
    });

    return res.status(200).json({
      message: "Follow-up rescheduled successfully",
      followUp,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createFollowup,
  markCompletion,
  getFollowups,
  rescheduleFollowup,
};
