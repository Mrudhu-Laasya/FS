const AboutMe = require("../models/AboutMe");

const getAboutMe = async (req, res) => {
  try {
    const aboutMe = await AboutMe.findOne();
    res.json(aboutMe);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateAboutMe = async (req, res) => {
  try {
    const aboutMe = await AboutMe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" },
    );
    res.json(aboutMe);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAboutMe,
  updateAboutMe,
};
