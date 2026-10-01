const { response } = require("express");
const Education = require("../models/Education");

const getEducation = async (req, res) => {
  try {
    const educationResponse = await Education.find();
    res.json(educationResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const createEducation = async (req, res) => {
  try {
    const createEducationResponse = await Education.create(req.body);
    res.json(createEducationResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateEducation = async (req, res) => {
  try {
    const updateEducationResponse = await Education.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" },
    );
    res.status(201).json(updateEducationResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const deleteEducationResponse = await Education.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteEducationResponse) {
      return res.status(404).json({
        message: "Education not found",
      });
    }
    res.status(200).json({
      message: "Education deleted successfully",
      education: deleteEducationResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getEducation,
  createEducation,
  deleteEducation,
  updateEducation,
};
