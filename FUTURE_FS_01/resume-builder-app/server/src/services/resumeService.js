const AboutMe = require("../models/AboutMe");
const Achievements = require("../models/Achievements");
const Certificates = require("../models/Certificates");
const Education = require("../models/Education");
const Hobbies = require("../models/Hobbies");
const Projects = require("../models/Projects");
const SoftSkills = require("../models/SoftSkills");
const TechnicalSkills = require("../models/TechnicalSkills");
const WorkExperience = require("../models/WorkExperience");

const createResumeSnapshot = async () => {
  return {
    aboutMe: await AboutMe.find().lean(),
    achievements: await Achievements.find().lean(),
    certificates: await Certificates.find().lean(),
    education: await Education.find().lean(),
    hobbies: await Hobbies.find().lean(),
    projects: await Projects.find().lean(),
    softSkills: await SoftSkills.find().lean(),
    technicalSkills: await TechnicalSkills.find().lean(),
    workExperience: await WorkExperience.find().lean(),
  };
};

const sections = {
  aboutMe: AboutMe,
  achievements: Achievements,
  certificates: Certificates,
  education: Education,
  hobbies: Hobbies,
  projects: Projects,
  softSkills: SoftSkills,
  technicalSkills: TechnicalSkills,
  workExperience: WorkExperience,
};

const restoreSection = async (Model, currentDocuments, backupDocuments) => {
  const currentMap = new Map(
    currentDocuments.map((doc) => [doc._id.toString(), doc]),
  );

  const backupMap = new Map(
    backupDocuments.map((doc) => [doc._id.toString(), doc]),
  );

  // 1. UPDATE existing documents
  for (const [id, backupDoc] of backupMap) {
    if (currentMap.has(id)) {
      const { _id, ...updateData } = backupDoc;

      await Model.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          returnDocument: "after",
          runValidators: true,
        },
      );
    }
  }

  // 2. DELETE documents that were created by admin
  for (const [id] of currentMap) {
    if (!backupMap.has(id)) {
      await Model.findByIdAndDelete(id);
    }
  }

  // 3. CREATE documents that existed before admin login
  //    but were deleted by admin
  for (const [id, backupDoc] of backupMap) {
    if (!currentMap.has(id)) {
      await Model.create(backupDoc);
    }
  }
};

const restoreResumeSnapshot = async (resumeBackup) => {
  for (const [sectionName, Model] of Object.entries(sections)) {
    const currentDocuments = await Model.find().lean();

    const backupDocuments = resumeBackup.backupData[sectionName] || [];

    await restoreSection(Model, currentDocuments, backupDocuments);
  }
};

module.exports = {
  createResumeSnapshot,
  restoreResumeSnapshot,
};
