import { useState } from "react";

export default function HobbiesForm({ initialData, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
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
    <>
      <div className="hobby-edit-form">
        <div className="form-field">
          <label>Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter hobby title"
          />
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter hobby description"
          />
        </div>
        <div className="hobby-form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>

          <button
            type="button"
            className="update-button"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
}
