import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import "../index.css";

const API_URL = import.meta.env.VITE_API_URL;

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);

  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchLead = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/leads/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch lead");
      }

      setLead(data);
    } catch (error) {
      setError(error.message);
    }
  }, [id, token]);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/activities/lead/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch activities");
      }

      setActivities(data);
    } catch (error) {
      console.error(error);
    }
  }, [id, token]);

  const loadLeadData = useCallback(async () => {
    setLoading(true);

    await Promise.all([fetchLead(), fetchActivities()]);

    setLoading(false);
  }, [fetchLead, fetchActivities]);

  useEffect(() => {
    const fetchData = async () => {
      await loadLeadData();
    };
    fetchData();
  }, [loadLeadData]);

  // -------------------------
  // CHANGE STATUS
  // -------------------------

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setLead(data.lead);

      // Refresh activity timeline
      await fetchActivities();
    } catch (error) {
      setError(error.message);
    }
  };

  // -------------------------
  // ADD NOTE
  // -------------------------

  const handleAddNote = async () => {
    if (!noteText.trim()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/leads/${id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: noteText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add note");
      }

      setLead((previousLead) => ({
        ...previousLead,
        notes: [...previousLead.notes, data.note],
      }));

      setNoteText("");

      await fetchActivities();
    } catch (error) {
      setError(error.message);
    }
  };

  // -------------------------
  // EDIT NOTE
  // -------------------------

  const handleEditNote = async (noteId) => {
    if (!editingText.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/leads/${id}/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: editingText,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      setLead((previousLead) => ({
        ...previousLead,
        notes: previousLead.notes.map((note) =>
          note._id === noteId ? data.note : note,
        ),
      }));

      setEditingNoteId(null);
      setEditingText("");
    } catch (error) {
      setError(error.message);
    }
  };

  // -------------------------
  // DELETE NOTE
  // -------------------------

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/leads/${id}/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      setLead((previousLead) => ({
        ...previousLead,
        notes: previousLead.notes.filter((note) => note._id !== noteId),
      }));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <DashboardHeader />

        <div className="dashboard-body">
          <Sidebar />

          <main className="dashboard-main">
            <div className="lead-details-message">Loading lead...</div>
          </main>
        </div>
      </div>
    );
  }

  if (error && !lead) {
    return (
      <div className="dashboard">
        <DashboardHeader />

        <div className="dashboard-body">
          <Sidebar />

          <main className="dashboard-main">
            <div className="lead-details-message error">{error}</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <DashboardHeader />

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-main lead-details-page">
          {/* Header */}
          <div className="lead-details-header">
            <div>
              <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
              </button>

              <h1>{lead.name}</h1>

              <p>
                {lead.email}
                {lead.company && ` · ${lead.company}`}
              </p>
            </div>

            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`status-select ${lead.status}`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <div className="lead-details-grid">
            {/* LEFT */}
            <div>
              {/* Lead Information */}
              <section className="details-card">
                <h2>Lead Information</h2>

                <div className="details-list">
                  <div>
                    <span>Email</span>
                    <strong>{lead.email}</strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>{lead.phone || "Not provided"}</strong>
                  </div>

                  <div>
                    <span>Company</span>
                    <strong>{lead.company || "Not provided"}</strong>
                  </div>

                  <div>
                    <span>Service</span>
                    <strong>{lead.service}</strong>
                  </div>

                  <div>
                    <span>Source</span>
                    <strong>{lead.source}</strong>
                  </div>

                  <div>
                    <span>Created</span>
                    <strong>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                <div className="message-section">
                  <span>Message</span>

                  <p>{lead.message}</p>
                </div>
              </section>

              {/* NOTES */}
              <section className="details-card notes-card">
                <h2>Follow-up Notes</h2>

                <div className="note-input">
                  <textarea
                    placeholder="Write a note about this lead..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />

                  <button onClick={handleAddNote} disabled={!noteText.trim()}>
                    Add Note
                  </button>
                </div>

                <div className="notes-list">
                  {lead.notes.length === 0 ? (
                    <p className="empty-text">No notes yet.</p>
                  ) : (
                    lead.notes
                      .slice()
                      .reverse()
                      .map((note) => (
                        <div className="note-item" key={note._id}>
                          {editingNoteId === note._id ? (
                            <div>
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                              />

                              <div className="note-actions">
                                <button
                                  onClick={() => handleEditNote(note._id)}
                                >
                                  Save
                                </button>

                                <button
                                  className="cancel-button"
                                  onClick={() => {
                                    setEditingNoteId(null);
                                    setEditingText("");
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p>{note.text}</p>

                              <div className="note-footer">
                                <span>
                                  {new Date(note.createdAt).toLocaleString()}
                                </span>

                                <div>
                                  <button
                                    onClick={() => {
                                      setEditingNoteId(note._id);
                                      setEditingText(note.text);
                                    }}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="delete-button"
                                    onClick={() => handleDeleteNote(note._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT - ACTIVITY */}
            <section className="details-card activity-card">
              <h2>Activity</h2>

              {activities.length === 0 ? (
                <p className="empty-text">No activity yet.</p>
              ) : (
                <div className="activity-list">
                  {activities.map((activity) => (
                    <div className="activity-item" key={activity._id}>
                      <div className="activity-dot" />

                      <div>
                        <strong>{activity.description}</strong>

                        <span>
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadDetails;
