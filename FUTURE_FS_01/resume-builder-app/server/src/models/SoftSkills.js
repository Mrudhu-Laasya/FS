const mongoose = require("mongoose");

const softSkillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SoftSkill", softSkillSchema, "softSkills");
