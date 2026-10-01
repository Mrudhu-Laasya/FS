const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: String,
      required: true,
    },

    endDate: {
      type: String,
      required: true,
    },

    isPromoted: {
      type: Boolean,
      default: false,
    },

    responsibilities: {
      type: [String],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const workExperienceSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      trim: true,
    },

    roles: {
      type: [roleSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "WorkExperience",
  workExperienceSchema,
  "workExperience",
);
