const mongoose = require("mongoose");

const technicalSkillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "TechnicalSkill",
  technicalSkillSchema,
  "technicalSkills",
);
