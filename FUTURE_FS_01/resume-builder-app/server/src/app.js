const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const aboutMeRoutes = require("./routes/aboutMeRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const authRoutes = require("./routes/authRoutes");
const certificationRoutes = require("./routes/certificationRoutes");
const educationRoutes = require("./routes/educationRoutes");
const hobbyRoutes = require("./routes/hobbyRoutes");
const projectRoutes = require("./routes/projectRoutes");
const softSkillsRoutes = require("./routes/softSkillRoutes");
const technicalSkillRoutes = require("./routes/technicalSkillRoutes");
const workExperienceRoutes = require("./routes/workExperienceRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/about-me", aboutMeRoutes);
app.use("/api/achievement", achievementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/certification", certificationRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/hobby", hobbyRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/soft-skill", softSkillsRoutes);
app.use("/api/technical-skill", technicalSkillRoutes);
app.use("/api/users", userRoutes);
app.use("/api/work-experience", workExperienceRoutes);

module.exports = app;
