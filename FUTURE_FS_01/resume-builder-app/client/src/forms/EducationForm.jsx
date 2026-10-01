import { useState } from "react";
export default function EducationForm({ initialData, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    degree: initialData.degree || "",
    field: initialData.field || "",
    college: initialData.college || "",
    score: {
      value: initialData.score?.value || "",
      type: initialData.score?.type || "",
    },
    duration: initialData.duration || "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("score.")) {
      const scoreField = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        score: {
          ...prev.score,
          [scoreField]: value,
        },
      }));

      return;
    }
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
      <div className="education-edit-form">
        <div className="form-field">
          <label>Degree</label>

          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="Enter degree"
          />
        </div>

        <div className="form-field">
          <label>Field</label>

          <input
            type="text"
            name="field"
            value={formData.field}
            onChange={handleChange}
            placeholder="Enter field"
          />
        </div>

        <div className="form-field">
          <label>College</label>

          <textarea
            name="college"
            value={formData.college}
            onChange={handleChange}
            placeholder="Enter College"
          />
        </div>

        <div className="form-field">
          <label>Score</label>
          <input
            type="text"
            name="score.type"
            value={formData.score.type}
            onChange={handleChange}
            placeholder="CGPA/Percentage"
          />
          <input
            type="text"
            name="score.value"
            value={formData.score.value}
            onChange={handleChange}
            placeholder="value"
          />
        </div>
        <div className="form-field">
          <label>Duration</label>

          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="2020-2025"
          />
        </div>

        <div className="Education-form-actions">
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
