import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import "../index.css";

const API_URL = import.meta.env.VITE_API_URL;

const LeadsPage = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (status) {
        params.append("status", status);
      }

      if (sort) {
        params.append("sort", sort);
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/leads?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch leads");
      }

      setLeads(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [search, sort, status]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchLeads();
    };
    fetchData();
  }, [fetchLeads]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchLeads]);

  const getStatusClass = (status) => {
    return `lead-status ${status}`;
  };

  return (
    <div className="dashboard">
      <DashboardHeader />

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-main leads-page">
          <div className="page-heading">
            <div>
              <h1>All Leads</h1>
              <p>Manage and track all your incoming leads.</p>
            </div>
          </div>

          {/* Filters */}
          <div className="lead-filters">
            <div className="search-wrapper">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search by name, email or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>

          {/* Leads table */}
          <div className="leads-card">
            {loading ? (
              <div className="leads-message">Loading leads...</div>
            ) : error ? (
              <div className="leads-message error">{error}</div>
            ) : leads.length === 0 ? (
              <div className="leads-message">No leads found.</div>
            ) : (
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Company</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead._id}
                      onClick={() => navigate(`/leads/${lead._id}`)}
                    >
                      <td>
                        <div className="lead-info">
                          <strong>{lead.name}</strong>
                          <span>{lead.email}</span>
                        </div>
                      </td>

                      <td>{lead.company || "—"}</td>

                      <td>{lead.service}</td>

                      <td>
                        <span className={getStatusClass(lead.status)}>
                          {lead.status}
                        </span>
                      </td>

                      <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadsPage;
