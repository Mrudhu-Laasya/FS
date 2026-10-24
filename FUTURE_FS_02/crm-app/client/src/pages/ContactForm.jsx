import { useState } from "react";
import { Link } from "react-router-dom";
import { createLead } from "../services/api";
import "../index.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await createLead({
        ...formData,
        source: "Website", // Add source as expected by backend
      });

      if (response.message === "Lead created successfully") {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          message: "",
        });

        // Optional: Reset form after 3 seconds
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <div className="brand">
          <div className="brand-logo">L</div>
          <span>LeadFlow</span>
        </div>

        <Link to="/login" className="admin-login">
          Admin Login
        </Link>
      </header>

      <main className="contact-container">
        <section className="contact-intro">
          <span className="eyebrow">LET'S CONNECT</span>

          <h1>
            Let's talk about
            <span> your project.</span>
          </h1>

          <p>
            Have a project in mind or looking for a solution? Tell us a little
            about your requirements and our team will get back to you.
          </p>

          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon">@</div>
              <div>
                <small>Email</small>
                <p>hello@leadflow.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">↗</div>
              <div>
                <small>Response time</small>
                <p>Usually within 24 hours</p>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-card">
          <div className="card-header">
            <h2>Tell us about yourself</h2>
            <p>Fill in the details below and we'll be in touch.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span>*</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company</label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="service">
                What can we help you with? <span>*</span>
              </label>

              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select a service</option>

                <option value="web-development">Web Development</option>

                <option value="mobile-development">Mobile Development</option>

                <option value="ui-ux">UI / UX Design</option>

                <option value="consulting">Consulting</option>

                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Tell us about your project <span>*</span>
              </label>

              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell us about your project, requirements, timeline, or anything else you'd like us to know..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending..." : "Send Inquiry"}
              <span>→</span>
            </button>

            {status === "success" && (
              <p className="success-message">
                Thank you! Your inquiry has been sent successfully.
              </p>
            )}

            {status === "error" && (
              <p className="error-message">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </section>
      </main>

      <footer className="contact-footer">
        <p>© 2026 LeadFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
