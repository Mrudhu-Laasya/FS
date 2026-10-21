
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../index.css";

const API_URL = import.meta.env.VITE_API_URL;

const activityTypes = [
  { label: "All activity", value: "all" },
  { label: "Lead created", value: "lead_created" },
  { label: "Status changed", value: "status_changed" },
  { label: "Note added", value: "note_added" },
  { label: "Follow-up scheduled", value: "follow_up_scheduled" },
];

const activityStyles = {
  lead_created: { icon: "+", className: "created" },
  status_changed: { icon: "↔", className: "status" },
  note_added: { icon: "✎", className: "note" },
  follow_up_scheduled: { icon: "◷", className: "follow-up" },
  lead_deleted: { icon: "−", className: "deleted" },
};

const formatDate = (date) => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Unknown date";
  }

  return value.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Activity = () => {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/activities`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load activity. Please try again.");
        }

        const data = await response.json();
        setActivities(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [navigate]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesType =
        filter === "all" || activity.action === filter;

      const leadName = activity.lead?.name || "";
      const description = activity.description || "";

      const matchesSearch =
        `${leadName} ${description}`
          .toLowerCase()
          .includes(search.toLowerCase().trim());

      return matchesType && matchesSearch;
    });
  }, [activities, filter, search]);

  return (
       <div className="dashboard">

      <DashboardHeader />

      <div className="dashboard-body">

        <Sidebar />
    <main className="activity-page">
      <div className="activity-heading">
        <div>
          <h1>Activity</h1>
          <p>Track all updates and actions across your leads.</p>
        </div>

        <span className="activity-count">
          {filteredActivities.length} activities
        </span>
      </div>

      <div className="activity-toolbar">
        <input
          type="search"
          placeholder="Search by lead or activity..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search activities"
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter activity type"
        >
          {activityTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="activity-state">Loading activities...</div>
      ) : error ? (
        <div className="activity-state activity-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="activity-state">
          <div className="activity-empty-icon">◷</div>
          <h3>No activity found</h3>
          <p>
            New lead submissions, status changes, and notes
            will appear here.
          </p>
        </div>
      ) : (
        <div className="activity-list">
          {filteredActivities.map((activity) => {
            const style =
              activityStyles[activity.action] ||
              { icon: "•", className: "default" };

            return (
              <article
                className="activity-item"
                key={activity._id}
              >
                <div
                  className={`activity-icon ${style.className}`}
                  aria-hidden="true"
                >
                  {style.icon}
                </div>

                <div className="activity-content">
                  <div className="activity-item-heading">
                    <h3>
                      {activity.lead?.name || "Unknown lead"}
                    </h3>

                    <time dateTime={activity.createdAt}>
                      {formatDate(activity.createdAt)}
                    </time>
                  </div>

                  <span className="activity-type">
                    {activityTypes.find(
                      (type) => type.value === activity.action
                    )?.label || activity.action?.replaceAll("_", " ")}
                  </span>

                  <p>{activity.description}</p>

                  {activity.previousStatus &&
                    activity.newStatus && (
                      <div className="activity-status-change">
                        <span>{activity.previousStatus}</span>
                        <span aria-hidden="true">→</span>
                        <span>{activity.newStatus}</span>
                      </div>
                    )}

                  {activity.lead?._id && (
                    <button
                      className="activity-view-link"
                      onClick={() =>
                        navigate(`/leads/${activity.lead._id}`)
                      }
                    >
                      View lead →
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
      </div>
      </div>
  );
};

export default Activity;