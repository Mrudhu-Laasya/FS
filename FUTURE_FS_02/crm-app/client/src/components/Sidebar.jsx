import { useNavigate, useLocation } from "react-router-dom";
import "../index.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-content">

        <div className="sidebar-section">
          <p className="sidebar-section-title">Overview</p>

          <button
            className={`sidebar-item ${
              isActive("/dashboard") ? "active" : ""
            }`}
            onClick={() => navigate("/dashboard")}
          >
            <span className="sidebar-icon">⌂</span>
            <span>Dashboard</span>
          </button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-title">Leads</p>

          <button
            className={`sidebar-item ${
              isActive("/leads") ? "active" : ""
            }`}
            onClick={() => navigate("/leads")}
          >
            <span className="sidebar-icon">≡</span>
            <span>All Leads</span>
          </button>

          <button
            className={`sidebar-item ${
              isActive("/leads/new") ? "active" : ""
            }`}
            onClick={() => navigate("/leads/new")}
          >
            <span className="sidebar-icon">●</span>
            <span>New</span>
          </button>

          <button
            className={`sidebar-item ${
              isActive("/leads/contacted") ? "active" : ""
            }`}
            onClick={() => navigate("/leads/contacted")}
          >
            <span className="sidebar-icon">◐</span>
            <span>Contacted</span>
          </button>

          <button
            className={`sidebar-item ${
              isActive("/leads/converted") ? "active" : ""
            }`}
            onClick={() => navigate("/leads/converted")}
          >
            <span className="sidebar-icon">✓</span>
            <span>Converted</span>
          </button>

          <button
            className={`sidebar-item ${
              isActive("/leads/lost") ? "active" : ""
            }`}
            onClick={() => navigate("/leads/lost")}
          >
            <span className="sidebar-icon">×</span>
            <span>Lost</span>
          </button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-title">Activity</p>

          <button
            className={`sidebar-item ${
              isActive("/activity") ? "active" : ""
            }`}
            onClick={() => navigate("/activity")}
          >
            <span className="sidebar-icon">◷</span>
            <span>Recent Activity</span>
          </button>

          <button
            className={`sidebar-item ${
              isActive("/follow-ups") ? "active" : ""
            }`}
            onClick={() => navigate("/follow-ups")}
          >
            <span className="sidebar-icon">◌</span>
            <span>Follow-ups</span>
          </button>
        </div>

      </div>

      <div className="sidebar-bottom">

        <div className="sidebar-admin">
          <div className="admin-avatar">A</div>

          <div className="admin-info">
            <span className="admin-label">Signed in as</span>
            <span className="admin-name">Admin</span>
          </div>
        </div>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">↪</span>
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;