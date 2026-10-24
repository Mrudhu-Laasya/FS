import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
import "../index.css";
import { getLeads } from "../services/api";

const LeadStatusPage = ({ title, description, endpoint }) => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getLeads(endpoint);
      setLeads(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchLeads();
    };
    fetchData();
  }, [fetchLeads]);

  return (
    <div className="dashboard">
      <DashboardHeader />

      <div className="dashboard-body">
        <Sidebar />

        <main className="dashboard-main lead-status-page">
          <div className="page-heading">
            <div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
          </div>

          <div className="lead-count">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
          </div>

          <div className="leads-card">
            {loading && <div className="leads-message">Loading leads...</div>}

            {error && !loading && (
              <div className="leads-message error">{error}</div>
            )}

            {!loading && !error && leads.length === 0 && (
              <div className="leads-message">
                No {title.toLowerCase()} found.
              </div>
            )}

            {!loading && !error && leads.length > 0 && (
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Company</th>
                    <th>Service</th>
                    <th>Email</th>
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

                      <td>{lead.email}</td>

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

export default LeadStatusPage;
