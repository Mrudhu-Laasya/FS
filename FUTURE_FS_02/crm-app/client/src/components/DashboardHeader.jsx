import { useNavigate } from "react-router-dom";
import "../index.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
      navigate("/login");
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-brand" onClick={() => navigate("/dashboard")}>
        <div className="header-logo">L</div>
        <span>LeadFlow</span>
      </div>

      <div className="header-right">
        <div className="header-user">
          <div className="header-avatar">A</div>

          <div className="header-user-info">
            <span className="header-user-name">Admin</span>
            <span className="header-user-role">Administrator</span>
          </div>
        </div>

        <button className="header-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
