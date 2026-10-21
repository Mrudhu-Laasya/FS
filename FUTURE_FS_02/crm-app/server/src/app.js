const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Resume Builder API is running",
  });
});

app.use("/api/leads", require("./routes/leadRoutes"));
app.use("/api/activities", require("./routes/activityRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/followups", require("./routes/followUpRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;