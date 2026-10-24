const express = require("express");
const router = express.Router();

const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

// LOGIN (public route - no auth required)
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

// All other admin-management routes require authentication
router.use(protect);

// CREATE admin
router.post("/", createAdmin);

// READ all admins
router.get("/", getAllAdmins);

// READ one admin
router.get("/:id", getAdminById);

// UPDATE admin
router.put("/:id", updateAdmin);

// DELETE admin
router.delete("/:id", deleteAdmin);

module.exports = router;
