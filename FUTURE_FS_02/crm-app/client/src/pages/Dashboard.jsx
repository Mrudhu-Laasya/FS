
import { useCallback, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

import { useNavigate } from "react-router-dom";

import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import { getDashboardSummary, getFollowups } from "../services/api.js";
import "../index.css";

const STATUS_COLORS = {
  new: "#3b82f6",
  contacted: "#f59e0b",
  converted: "#10b981",
  lost: "#ef4444",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatLabel = (value) =>
  value
    ? value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Activity";

const Dashboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [summary, setSummary] = useState(null);
  const [followUps, setFollowUps] = useState({
    overdue: [],
    dueToday: [],
    upcoming: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const filters =
        period === "custom"
          ? { period: "custom", startDate, endDate }
          : { period };

      if (
        period === "custom" &&
        (!startDate || !endDate || startDate > endDate)
      ) {
        setError("Choose a valid start date and end date.");
        setLoading(false);
        return;
      }

      const [dashboardData, followUpData] = await Promise.all([
        getDashboardSummary(filters),
        getFollowups(),
      ]);

      setSummary(dashboardData);

      const groups = followUpData.followUps || {};
      setFollowUps({
        overdue: groups.overdue || [],
        dueToday: groups.dueToday || [],
        upcoming: groups.upcoming || [],
      });
    } catch (err) {
      setError(err.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [period, startDate, endDate]);

  useEffect(() => {
    if (period !== "custom" || (startDate && endDate)) {
      loadDashboard();
    }
  }, [loadDashboard, period, startDate, endDate]);

  const leadStatusData = summary?.leads?.byStatus
    ? Object.entries(summary.leads.byStatus).map(([name, value]) => ({
      name: formatLabel(name),
      value,
      key: name,
    }))
    : [];

  const chartData = (summary?.charts?.daily || []).map((item) => ({
    ...item,
    label: new Date(`${item.date}T12:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
  }));

  const remindersCount =
    followUps.overdue.length + followUps.dueToday.length;

  const reminderGroups = [
    {
      title: "Overdue",
      description: "Need attention",
      items: followUps.overdue,
      className: "overdue",
    },
    {
      title: "Due today",
      description: "Follow up today",
      items: followUps.dueToday,
      className: "due-today",
    },
    {
      title: "Upcoming",
      description: "Scheduled next",
      items: followUps.upcoming,
      className: "upcoming",
    },
  ];


  return (
    <div className="dashboard">
      <DashboardHeader />

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-main leadflow-dashboard">
          <div className="dashboard-heading dashboard-title-row">
            <div>
              <h1>Dashboard</h1>
              <p>Track your leads, activities, and follow-up reminders.</p>
            </div>

            <a className="notification-link" href="/follow-ups">
              <span aria-hidden="true">♧</span>
              Reminders
              {remindersCount > 0 && (
                <span className="notification-count">
                  {remindersCount}
                </span>
              )}
            </a>
          </div>

          <section className="dashboard-filter-panel">
            <div className="period-control">
              <label>Analytics period</label>

              <div className="period-buttons">
                {[
                  { value: "day", label: "Daily" },
                  { value: "week", label: "Weekly" },
                  { value: "month", label: "Monthly" },
                  { value: "custom", label: "Custom date range" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`period-button ${period === option.value ? "active" : ""
                      }`}
                    onClick={() => setPeriod(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {period === "custom" && (
              <div className="custom-date-controls">
                <div>
                  <label htmlFor="start-date">Start date</label>
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="end-date">End date</label>
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(event) => setEndDate(event.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="dashboard-apply-button"
                  onClick={loadDashboard}
                  disabled={!startDate || !endDate || startDate > endDate}
                >
                  Apply dates
                </button>
              </div>
            )}

            {summary?.filters && (
              <p className="filter-range">
                Showing {formatDate(summary.filters.startDate)} –{" "}
                {formatDate(summary.filters.endDate)}
              </p>
            )}
          </section>


          {error && (
            <div className="dashboard-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={loadDashboard}>
                Retry
              </button>
            </div>
          )}

          {loading && !summary ? (
            <div className="dashboard-loading">Loading your dashboard…</div>
          ) : summary ? (
            <>
              <section className="dashboard-stats-grid">
                <article className="dashboard-stat-card">
                  <div className="stat-card-top">
                    <span>Total leads</span>
                    <span className="stat-icon blue">↗</span>
                  </div>
                  <strong>{summary.leads.total}</strong>
                  <small>Created during selected period</small>
                </article>

                <article className="dashboard-stat-card">
                  <div className="stat-card-top">
                    <span>Converted leads</span>
                    <span className="stat-icon green">✓</span>
                  </div>
                  <strong>{summary.leads.byStatus.converted || 0}</strong>
                  <small>Currently marked converted</small>
                </article>

                <article className="dashboard-stat-card">
                  <div className="stat-card-top">
                    <span>Conversion rate</span>
                    <span className="stat-icon purple">%</span>
                  </div>
                  <strong>{summary.leads.conversionRate}%</strong>
                  <small>Converted leads / leads created in period</small>
                </article>

                <article className="dashboard-stat-card">
                  <div className="stat-card-top">
                    <span>Activities</span>
                    <span className="stat-icon orange">≡</span>
                  </div>
                  <strong>{summary.activities.total}</strong>
                  <small>Recorded during selected period</small>
                </article>
              </section>

              <section className="dashboard-charts-grid">
                <article className="dashboard-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Lead status distribution</h2>
                      <p>Current statuses of leads created in this period</p>
                    </div>
                  </div>

                  {leadStatusData.some((item) => item.value > 0) ? (
                    <div className="status-chart">
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={leadStatusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            innerRadius={58}
                            outerRadius={92}
                            paddingAngle={3}
                          >
                            {leadStatusData.map((entry) => (
                              <Cell
                                key={entry.key}
                                fill={STATUS_COLORS[entry.key]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="chart-empty">
                      No leads in this period yet.
                    </div>
                  )}
                </article>

                <article className="dashboard-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Activity trends</h2>
                      <p>Daily leads, activities, and completed follow-ups</p>
                    </div>
                  </div>

                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart
                        data={chartData}
                        margin={{ top: 12, right: 12, left: -16, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 11 }}
                          minTickGap={18}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="leadsCreated"
                          name="Leads"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="activities"
                          name="Activities"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="completedFollowUps"
                          name="Completed follow-ups"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="chart-empty">
                      No trend data available.
                    </div>
                  )}
                </article>
              </section>

              <section className="dashboard-section">
                <div className="section-heading-row">
                  <div>
                    <h2>Follow-up reminders</h2>
                    <p>Pending tasks based on today's date</p>
                  </div>
                  <button onClick={() => navigate("/follow-ups")} className="text-link">
                    Manage follow-ups →
                  </button>
                </div>

                <div className="reminder-grid">
                  {reminderGroups.map((group) => (
                    <article
                      className={`reminder-card ${group.className}`}
                      key={group.title}
                    >
                      <div className="reminder-card-header">
                        <div>
                          <h3>{group.title}</h3>
                          <p>{group.description}</p>
                        </div>
                        <strong>{group.items.length}</strong>
                      </div>

                      {group.items.length > 0 ? (
                        <ul className="reminder-list">
                          {group.items.slice(0, 4).map((item) => (
                            <li key={item._id}>
                              <div>
                                <strong>
                                  {item.lead?.name || "Unknown lead"}
                                </strong>
                                <p>{item.followUpPurpose}</p>
                                <small>
                                  {item.followUpDate
                                    ? formatDate(item.followUpDate)
                                    : "No date"}
                                </small>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="empty-reminder">
                          No {group.title.toLowerCase()} follow-ups.
                        </p>
                      )}

                      {group.items.length > 4 && (
                        <button onClick={() => navigate("/follow-ups")} className="text-link">
                          Manage follow-ups →
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </section>

              <section className="dashboard-section">
                <div className="section-heading-row">
                  <div>
                    <h2>Recent activity</h2>
                    <p>Latest recorded events in the selected period</p>
                  </div>
                </div>

                <div className="dashboard-panel activity-panel">
                  {summary.activities.recent?.length > 0 ? (
                    <ul className="activity-timeline">
                      {summary.activities.recent.map((activity) => (
                        <li key={activity._id}>
                          <span className="activity-timeline-dot" />
                          <div className="activity-content">
                            <strong>{formatLabel(activity.action)}</strong>
                            <p>{activity.description}</p>
                            <div className="activity-meta">
                              <span>
                                {activity.lead?.name || "Lead unavailable"}
                              </span>
                              <span>
                                {activity.createdAt
                                  ? formatDate(activity.createdAt)
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="chart-empty">
                      No activities recorded in this period.
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : (
            !loading && (
              <div className="dashboard-loading">
                No dashboard data available.
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
