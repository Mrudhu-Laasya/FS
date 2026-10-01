const { response } = require("express");
const Hobbies = require("../models/Hobbies");

const getHobbies = async (req, res) => {
  try {
    const hobbyResponse = await Hobbies.find();
    res.json(hobbyResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const createHobby = async (req, res) => {
  try {
    const createHobbyResponse = await Hobbies.create(req.body);
    res.json(createHobbyResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateHobby = async (req, res) => {
  try {
    const updateHobbyResponse = await Hobbies.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" },
    );
    res.status(201).json(updateHobbyResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteHobby = async (req, res) => {
  try {
    const deleteHobbyResponse = await Hobbies.findByIdAndDelete(req.params.id);
    if (!deleteHobbyResponse) {
      return res.status(404).json({
        message: "Hobby not found",
      });
    }
    res.status(200).json({
      message: "Hobby deleted successfully",
      hobby: deleteHobbyResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getHobbies, createHobby, deleteHobby, updateHobby };
