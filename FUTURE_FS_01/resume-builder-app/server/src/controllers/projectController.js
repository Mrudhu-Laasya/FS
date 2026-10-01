const { response } = require("express");
const Projects = require("../models/Projects");

const getProjects = async (req, res) => {
  try {
    const projectsResponse = await Projects.find();
    res.json(projectsResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProject = async (req, res) => {
  try {
    const createProjectResponse = await Projects.create(req.body);
    res.json(createProjectResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const updateProjectResponse = await Projects.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: "after" },
    );
    res.status(201).json(updateProjectResponse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const deleteProjectResponse = await Projects.findByIdAndDelete(
      req.params.id,
    );
    if (!deleteProjectResponse) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    res.status(200).json({
      message: "Project deleted successfully",
      project: deleteProjectResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getProjects, createProject, deleteProject, updateProject };
