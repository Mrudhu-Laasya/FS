import { useState } from "react";
import "../index.css";

export default function CertificateForm({ initialData, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    issuer: initialData.issuer || "",
    issuedDate: initialData.issuedDate || "",
    certificateUrl: initialData.certificateUrl || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="certificate-edit-form">
      <div className="form-field">
        <label>Certificate Title</label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter Certificate Title"
        />
      </div>

      <div className="form-field">
        <label>Issuer</label>

        <input
          type="text"
          name="issuer"
          value={formData.issuer}
          onChange={handleChange}
          placeholder="Enter Issuing Organization"
        />
      </div>

      <div className="form-field">
        <label>Issued Date</label>

        <input
          type="text"
          name="issuedDate"
          value={formData.issuedDate}
          onChange={handleChange}
          placeholder="e.g. August 2026"
        />
      </div>

      <div className="form-field">
        <label>Certificate URL</label>

        <input
          type="url"
          name="certificateUrl"
          value={formData.certificateUrl}
          onChange={handleChange}
          placeholder="https://example.com/certificate"
        />
      </div>

      <div className="certificate-form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>

        <button type="button" className="update-button" onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
}
