
const express = require("express");
const router = express.Router();

const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  createNote,
  getLeadNotes,
  getNoteById,
  updateNote,
  deleteNote,

  getNewLeads,
  getContactedLeads,
  getConvertedLeads,
  getLostLeads,
} = require("../controllers/leadController");

const { protect } = require("../middleware/authMiddleware");

// Public endpoint: website contact form
router.post("/", createLead);

// Protected lead status routes
router.get("/new", protect, getNewLeads);
router.get("/contacted", protect, getContactedLeads);
router.get("/converted", protect, getConvertedLeads);
router.get("/lost", protect, getLostLeads);

// Protected lead CRUD
router.get("/", protect, getAllLeads);
router.get("/:id", protect, getLeadById);
router.put("/:id", protect, updateLead);
router.patch("/:id/status", protect, updateLeadStatus);
router.delete("/:id", protect, deleteLead);

// Protected note CRUD
router.post("/:id/notes", protect, createNote);
router.get("/:id/notes", protect, getLeadNotes);
router.get("/:id/notes/:noteId", protect, getNoteById);
router.put("/:id/notes/:noteId", protect, updateNote);
router.delete("/:id/notes/:noteId", protect, deleteNote);



module.exports = router;