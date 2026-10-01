import { useState } from "react";
import "../index.css";

export default function AchievementForm({ initialData, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    category: initialData.category || "",
    description: initialData.description || "",
    url: initialData.url || "",
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
    <div className="achievement-edit-form">
      <div className="form-field">
        <label>Title</label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter Achievement Title"
        />
      </div>

      <div className="form-field">
        <label>Category</label>

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Enter Achievement Category"
        />
      </div>

      <div className="form-field">
        <label>Description</label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter Achievement Description"
        />
      </div>

      <div className="form-field">
        <label>URL</label>

        <input
          type="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="Enter Relevant URL"
        />
      </div>

      <div className="achievement-form-actions">
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
