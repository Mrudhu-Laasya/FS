const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    action: {
      type: String,
      enum: [
        "lead_created",
        "status_changed",
        "note_added",
        "follow_up_scheduled",
        "follow_up_rescheduled",
        "follow_up_completed",
        "lead_deleted",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    previousStatus: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
    },
    newStatus: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Activity", activitySchema, "activity");
