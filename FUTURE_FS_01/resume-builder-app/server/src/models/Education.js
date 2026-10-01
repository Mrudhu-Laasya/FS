const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },

    field: {
      type: String,
      trim: true,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    score: {
      value: Number,
      type: {
        type: String,
        enum: ["CGPA", "Percentage"],
      },
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Education", educationSchema, "education");
