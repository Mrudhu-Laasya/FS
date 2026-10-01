const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    techStack: {
      type: [String],
      required: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Project", projectSchema, "projects");
