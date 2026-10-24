const express = require("express");
const router = express.Router();

const { getDashboardSummary } = require("../controllers/dashboardController");

// Add your existing admin-auth middleware here if the other
// dashboard APIs are protected.
router.get("/summary", getDashboardSummary);

module.exports = router;
