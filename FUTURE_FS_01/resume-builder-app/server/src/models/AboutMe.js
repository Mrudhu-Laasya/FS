const mongoose = require("mongoose");

const aboutMeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AboutMe", aboutMeSchema, "aboutMe");
