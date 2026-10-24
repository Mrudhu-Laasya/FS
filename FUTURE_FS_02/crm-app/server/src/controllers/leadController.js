const Lead = require("../models/Lead");
const Activity = require("../models/Activity");

// CREATE a lead (public contact form)
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, service, message, source } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({
        message: "Name, email, service, and message are required.",
      });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      service,
      message,
      source: source || "Website",
    });

    await Activity.create({
      lead: lead._id,
      action: "lead_created",
      description: `Lead created from ${lead.source}`,
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all leads (supports status filter and search)
const getAllLeads = async (req, res) => {
  try {
    const { status, search, sort } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    if (sort === "name") {
      sortOption = { name: 1 };
    }

    if (sort === "name-desc") {
      sortOption = { name: -1 };
    }

    const leads = await Lead.find(filter).sort(sortOption);

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// READ one lead by ID
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE lead details
const updateLead = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phone",
      "company",
      "service",
      "message",
      "source",
      "followUpDate",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE lead status
const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "contacted", "converted", "lost"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid lead status" });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const previousStatus = lead.status;
    lead.status = status;
    await lead.save();

    if (previousStatus !== status) {
      await Activity.create({
        lead: lead._id,
        admin: req.admin?._id || null,
        action: "status_changed",
        description: `Status changed from ${previousStatus} to ${status}`,
        previousStatus,
        newStatus: status,
      });
    }

    res.status(200).json({
      message: "Lead status updated successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Activity records reference leads, so remove them too.
    await Activity.deleteMany({ lead: lead._id });

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE a note inside a lead
const createNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.notes.push({
      text: text.trim(),
      createdBy: req.admin?._id || null,
    });

    await lead.save();

    const note = lead.notes[lead.notes.length - 1];

    await Activity.create({
      lead: lead._id,
      admin: req.admin?._id || null,
      action: "note_added",
      description: "A follow-up note was added",
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ all notes for a lead
const getLeadNotes = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "notes.createdBy",
      "name email",
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead.notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ one note by note ID
const getNoteById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = lead.notes.id(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE one note by note ID
const updateNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Note text is required" });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = lead.notes.id(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.text = text.trim();
    await lead.save();

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE one note by note ID
const deleteNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = lead.notes.id(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Mongoose document-array method
    lead.notes.pull({ _id: req.params.noteId });
    await lead.save();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all new leads
const getNewLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      status: "new",
    }).sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all contacted leads
const getContactedLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      status: "contacted",
    }).sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all converted leads
const getConvertedLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      status: "converted",
    }).sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all lost leads
const getLostLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      status: "lost",
    }).sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
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
};
