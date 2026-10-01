const { response } = require("express");
const WorkExperience = require("../models/WorkExperience");
const updateRole = async (req, res) => {
  try {
    const { workExperienceId, roleIndex } = req.params;

    const roleUpdateResponse = await WorkExperience.findOneAndUpdate(
      {
        _id: workExperienceId,
      },
      {
        $set: {
          [`roles.${roleIndex}.position`]: req.body.position,
          [`roles.${roleIndex}.startDate`]: req.body.startDate,
          [`roles.${roleIndex}.endDate`]: req.body.endDate,
          [`roles.${roleIndex}.isPromoted`]: req.body.isPromoted,
          [`roles.${roleIndex}.responsibilities`]: req.body.responsibilities,
        },
      },
      {
        returnDocument: "after",
      },
    );

    if (!roleUpdateResponse) {
      return res.status(404).json({
        message: "Work experience or role not found",
      });
    }

    res.status(200).json(roleUpdateResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { workExperienceId, roleIndex } = req.params;
    const workExperience = await WorkExperience.findOne({
      _id: workExperienceId,
    });

    if (!workExperience) {
      return res.status(404).json({
        message: "Work experience not found",
      });
    }
    workExperience.roles.splice(Number(roleIndex), 1);

    await workExperience.save();

    res.status(200).json(workExperience);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWorkExperience = async (req, res) => {
  try {
    const workExperienceResponse = await WorkExperience.find();
    res.json(workExperienceResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createWorkExperience = async (req, res) => {
  try {
    const createWorkExperienceResponse = await WorkExperience.create(req.body);
    res.json(createWorkExperienceResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateWorkExperience = async (req, res) => {
  try {
    const updateWorkExperienceResponse = await WorkExperience.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" },
    );
    res.status(201).json(updateWorkExperienceResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteWorkExperience = async (req, res) => {
  try {
    const deleteWorkExperienceResponse = await WorkExperience.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteWorkExperienceResponse) {
      return res.status(404).json({
        message: "Work Experience not found",
      });
    }
    res.status(200).json({
      message: "Work Experience deleted successfully",
      workExperience: deleteWorkExperienceResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getWorkExperience,
  createWorkExperience,
  deleteWorkExperience,
  updateWorkExperience,
  updateRole,
  deleteRole,
};
