import { useCallback, useEffect, useState } from "react";
import {
  getFollowups,
  markCompletion,
  rescheduleFollowup,
  createFollowup,
  getLeads,
} from "../services/api.js";
import "../index.css";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";

const CATEGORIES = [
  { key: "overdue", label: "Overdue" },
  { key: "dueToday", label: "Due Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const EMPTY_COUNTS = {
  overdue: 0,
  dueToday: 0,
  upcoming: 0,
  completed: 0,
  cancelled: 0,
};

const EMPTY_FOLLOWUPS = {
  overdue: [],
  dueToday: [],
  upcoming: [],
  completed: [],
  cancelled: [],
};

// Convert a date to the format required by datetime-local.
const toLocalDateTime = (date) => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "";

  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
};

const formatDate = (date) => {
  if (!date) return "Not available";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "Invalid date";

  return value.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const FollowUps = () => {
  const [activeCategory, setActiveCategory] = useState("overdue");
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [followUps, setFollowUps] = useState(EMPTY_FOLLOWUPS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [completionId, setCompletionId] = useState(null);
  const [outcome, setOutcome] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newFollowup, setNewFollowup] = useState({
    lead: "",
    followUpDate: "",
    followUpPurpose: "",
  });
  const [creating, setCreating] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leads, setLeads] = useState([]);

  const loadFollowups = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getFollowups();

      if (data.message && !data.followUps) {
        throw new Error(data.message);
      }

      setCounts({ ...EMPTY_COUNTS, ...data.counts });
      setFollowUps({ ...EMPTY_FOLLOWUPS, ...data.followUps });
    } catch (err) {
      setError(err.message || "Failed to load follow-ups.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await loadFollowups();
    };
    fetchData();
  }, [loadFollowups]);

  const handleCreateFollowup = async (event) => {
    event.preventDefault();

    if (
      !newFollowup.lead ||
      !newFollowup.followUpDate ||
      !newFollowup.followUpPurpose.trim()
    ) {
      setError("Please complete all follow-up fields.");
      return;
    }

    if (new Date(newFollowup.followUpDate).getTime() <= Date.now()) {
      setError("Please choose a future date and time.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const result = await createFollowup({
        lead: newFollowup.lead,
        followUpDate: new Date(newFollowup.followUpDate).toISOString(),
        followUpPurpose: newFollowup.followUpPurpose.trim(),
      });

      if (result.message && !result.followUp) {
        throw new Error(result.message);
      }

      setNewFollowup({
        lead: "",
        followUpDate: "",
        followUpPurpose: "",
      });

      setShowCreateForm(false);
      setActiveCategory("upcoming");

      await loadFollowups(true);
    } catch (err) {
      setError(err.message || "Failed to schedule follow-up.");
    } finally {
      setCreating(false);
    }
  };

  const handleComplete = async (id) => {
    if (!outcome.trim()) {
      setError("Please enter the follow-up outcome.");
      return;
    }

    try {
      setError("");
      await markCompletion(id, outcome.trim());

      setCompletionId(null);
      setOutcome("");

      await loadFollowups(true);
    } catch (err) {
      setError(err.message || "Failed to complete follow-up.");
    }
  };

  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    setError("");

    try {
      const data = await getLeads();

      const leadList = Array.isArray(data) ? data : data.leads;

      if (!Array.isArray(leadList)) {
        throw new Error("Unexpected leads API response.");
      }

      setLeads(leadList);
    } catch (err) {
      setError(err.message || "Failed to load leads.");
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      loadLeads();
    };
    fetchData();
  }, [loadLeads]);

  const handleReschedule = async (id) => {
    if (!newDate) {
      setError("Please select a new date and time.");
      return;
    }

    if (new Date(newDate).getTime() <= Date.now()) {
      setError("Please choose a future date and time.");
      return;
    }

    try {
      setError("");

      await rescheduleFollowup(id, new Date(newDate).toISOString());

      setRescheduleId(null);
      setNewDate("");

      await loadFollowups(true);
    } catch (err) {
      setError(err.message || "Failed to reschedule follow-up.");
    }
  };

  const currentFollowups = followUps[activeCategory] || [];

  return (
    <div className="dashboard">
      <DashboardHeader />

      <div className="dashboard-body">
        <Sidebar />
        <main className="followups-page">
          <header className="followups-header">
            <div>
              <h1>Follow-ups</h1>
              <p>Manage scheduled calls, follow-up tasks, and outcomes.</p>
            </div>
            <div className="followups-header-actions">
              <button
                type="button"
                className="followups-schedule-btn"
                onClick={() => setShowCreateForm(true)}
              >
                + Schedule Follow-up
              </button>
              <button
                type="button"
                className="followups-refresh"
                onClick={() => loadFollowups(true)}
                disabled={loading || refreshing}
              >
                {refreshing ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>
          </header>

          {showCreateForm && (
            <section className="followup-create-panel">
              <div className="followup-create-header">
                <div>
                  <h2>Schedule a Follow-up</h2>
                  <p>Choose a lead and set the next contact date.</p>
                </div>

                <button
                  type="button"
                  className="followup-close-btn"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError("");
                  }}
                  aria-label="Close form"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateFollowup}>
                <div className="followup-create-grid">
                  <div className="followup-field">
                    <label htmlFor="followup-lead">Select Lead *</label>

                    <select
                      id="followup-lead"
                      value={newFollowup.lead}
                      onChange={(event) =>
                        setNewFollowup((prev) => ({
                          ...prev,
                          lead: event.target.value,
                        }))
                      }
                      required
                      disabled={loadingLeads}
                    >
                      <option value="">
                        {loadingLeads ? "Loading leads..." : "Choose a lead"}
                      </option>

                      {leads.map((lead) => (
                        <option key={lead._id} value={lead._id}>
                          {lead.name}
                          {lead.company ? ` — ${lead.company}` : ""}
                        </option>
                      ))}
                    </select>

                    {!loadingLeads && leads.length === 0 && (
                      <small>
                        No leads found. Add a lead before scheduling.
                      </small>
                    )}
                  </div>

                  <div className="followup-field">
                    <label htmlFor="followup-date">Date and Time *</label>

                    <input
                      id="followup-date"
                      type="datetime-local"
                      value={newFollowup.followUpDate}
                      min={toLocalDateTime(new Date())}
                      onChange={(event) =>
                        setNewFollowup((prev) => ({
                          ...prev,
                          followUpDate: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="followup-field full-width">
                    <label htmlFor="followup-purpose">Purpose *</label>

                    <textarea
                      id="followup-purpose"
                      rows={3}
                      placeholder="e.g. Call the client to discuss pricing"
                      value={newFollowup.followUpPurpose}
                      onChange={(event) =>
                        setNewFollowup((prev) => ({
                          ...prev,
                          followUpPurpose: event.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="followup-create-actions">
                  <button
                    type="button"
                    className="followup-btn secondary"
                    onClick={() => {
                      setShowCreateForm(false);
                      setError("");
                    }}
                    disabled={creating}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="followup-btn primary"
                    disabled={creating || loadingLeads || leads.length === 0}
                  >
                    {creating ? "Scheduling..." : "Schedule Follow-up"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="followups-summary" aria-label="Follow-up summary">
            {CATEGORIES.map((category) => (
              <button
                type="button"
                key={category.key}
                className={`followups-summary-card ${
                  activeCategory === category.key ? "active" : ""
                } ${category.key}`}
                onClick={() => setActiveCategory(category.key)}
              >
                <span className="followups-summary-label">
                  {category.label}
                </span>
                <strong>{counts[category.key] ?? 0}</strong>
              </button>
            ))}
          </section>

          <section className="followups-list-section">
            <div className="followups-list-header">
              <div>
                <h2>
                  {
                    CATEGORIES.find((item) => item.key === activeCategory)
                      ?.label
                  }
                </h2>
                <p>
                  {counts[activeCategory] ?? 0} task
                  {counts[activeCategory] === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {error && (
              <div className="followups-error" role="alert">
                <span>{error}</span>
                <button type="button" onClick={() => setError("")}>
                  Dismiss
                </button>
              </div>
            )}

            {loading ? (
              <div className="followups-state">Loading follow-ups...</div>
            ) : currentFollowups.length === 0 ? (
              <div className="followups-empty">
                <div className="followups-empty-icon">✓</div>
                <h3>
                  No{" "}
                  {CATEGORIES.find(
                    (item) => item.key === activeCategory,
                  )?.label.toLowerCase()}{" "}
                  follow-ups
                </h3>
                <p>Tasks in this category will appear here.</p>
              </div>
            ) : (
              <div className="followups-list">
                {currentFollowups.map((item) => {
                  const lead =
                    item.lead && typeof item.lead === "object"
                      ? item.lead
                      : null;

                  const id = item._id;

                  return (
                    <article className="followup-card" key={id}>
                      <div className="followup-card-top">
                        <div className="followup-lead-info">
                          <h3>{lead?.name || "Unknown lead"}</h3>
                          <p>{lead?.company || "No company specified"}</p>
                        </div>

                        <span
                          className={`followup-status ${item.status || "pending"}`}
                        >
                          {item.status || "pending"}
                        </span>
                      </div>

                      <div className="followup-details">
                        {lead?.email && (
                          <p>
                            <span>Email</span>
                            <a href={`mailto:${lead.email}`}>{lead.email}</a>
                          </p>
                        )}

                        <p>
                          <span>Purpose</span>
                          {item.followUpPurpose}
                        </p>

                        <p>
                          <span>Scheduled</span>
                          {formatDate(item.followUpDate)}
                        </p>

                        {item.completedAt && (
                          <p>
                            <span>Completed</span>
                            {formatDate(item.completedAt)}
                          </p>
                        )}

                        {item.outcome && (
                          <p className="followup-outcome">
                            <span>Outcome</span>
                            {item.outcome}
                          </p>
                        )}
                      </div>

                      {item.status === "pending" &&
                        activeCategory !== "completed" &&
                        activeCategory !== "cancelled" && (
                          <div className="followup-actions">
                            <button
                              type="button"
                              className="followup-btn primary"
                              onClick={() => {
                                setCompletionId(id);
                                setOutcome("");
                                setRescheduleId(null);
                                setError("");
                              }}
                            >
                              Mark Complete
                            </button>

                            <button
                              type="button"
                              className="followup-btn secondary"
                              onClick={() => {
                                setRescheduleId(id);
                                setNewDate(toLocalDateTime(item.followUpDate));
                                setCompletionId(null);
                                setError("");
                              }}
                            >
                              Reschedule
                            </button>
                          </div>
                        )}

                      {completionId === id && (
                        <form
                          className="followup-inline-form"
                          onSubmit={(event) => {
                            event.preventDefault();
                            handleComplete(id);
                          }}
                        >
                          <label htmlFor={`outcome-${id}`}>
                            Follow-up outcome
                          </label>
                          <textarea
                            id={`outcome-${id}`}
                            value={outcome}
                            onChange={(event) => setOutcome(event.target.value)}
                            placeholder="What happened during the call?"
                            rows={3}
                            required
                          />

                          <div className="followup-form-actions">
                            <button
                              type="submit"
                              className="followup-btn primary"
                            >
                              Save Outcome
                            </button>
                            <button
                              type="button"
                              className="followup-btn secondary"
                              onClick={() => {
                                setCompletionId(null);
                                setOutcome("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}

                      {rescheduleId === id && (
                        <form
                          className="followup-inline-form"
                          onSubmit={(event) => {
                            event.preventDefault();
                            handleReschedule(id);
                          }}
                        >
                          <label htmlFor={`reschedule-${id}`}>
                            New date and time
                          </label>
                          <input
                            id={`reschedule-${id}`}
                            type="datetime-local"
                            value={newDate}
                            onChange={(event) => setNewDate(event.target.value)}
                            min={toLocalDateTime(new Date())}
                            required
                          />

                          <div className="followup-form-actions">
                            <button
                              type="submit"
                              className="followup-btn primary"
                            >
                              Save New Date
                            </button>
                            <button
                              type="button"
                              className="followup-btn secondary"
                              onClick={() => {
                                setRescheduleId(null);
                                setNewDate("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default FollowUps;
