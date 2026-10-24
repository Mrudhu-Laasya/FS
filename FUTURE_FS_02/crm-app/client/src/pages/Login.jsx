import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import { login } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(formData.email, formData.password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(
        `An error occurred.${err.message ? ` ${err.message}` : ""} Please try again.`,
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">L</div>
          <span>LeadFlow</span>
        </div>

        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to manage your leads and follow-ups.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="login-form-group">
            <div className="password-label">
              <label htmlFor="password">Password</label>

              <button type="button" className="forgot-password">
                Forgot password?
              </button>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Sign In
            <span>→</span>
          </button>
        </form>

        <div className="login-footer">
          <span>Not an admin?</span>
          <Link to="/contact">Back to Contact Page</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
