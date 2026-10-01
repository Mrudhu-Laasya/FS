import { useState } from "react";
import AddButton from "../components/AddButton";
import useEdit from "../context/useEdit";
export default function RoleForm({ initialData, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    position: initialData.position || "",
    startDate: initialData.startDate || "",
    endDate: initialData.endDate || "",
    responsibilities: initialData.responsibilities || [],
    isPromoted: initialData.isPromoted || false,
  });
  const { isEditValid } = useEdit();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleResponsibilityChange = (index, value) => {
    setFormData((prev) => {
      const updatedResponsibilities = [...prev.responsibilities];

      updatedResponsibilities[index] = value;

      return {
        ...prev,
        responsibilities: updatedResponsibilities,
      };
    });
  };

  const addResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const deleteResponsibility = (index) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="role-edit-form">
      {/* Position */}
      <div className="form-field">
        <label>Position</label>

        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="Software Engineer II"
        />
      </div>

      {/* Start Date */}
      <div className="form-field">
        <label>Start Date</label>

        <input
          type="text"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          placeholder="Dec 2025"
        />
      </div>

      {/* End Date */}
      <div className="form-field">
        <label>End Date</label>

        <input
          type="text"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          placeholder="Jun 2026"
        />
      </div>

      {/* Responsibilities */}
      <div className="form-field">
        <label>Responsibilities</label>

        {formData.responsibilities.map((responsibility, index) => (
          <div className="responsibility-input" key={index}>
            <textarea
              value={responsibility}
              onChange={(e) =>
                handleResponsibilityChange(index, e.target.value)
              }
              placeholder={`Responsibility ${index + 1}`}
            />
            {isEditValid && (
              <button
                type="button"
                className="x-delete"
                onClick={() => deleteResponsibility(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {isEditValid && (
          <AddButton onClick={addResponsibility}> Add Responsibility</AddButton>
        )}
      </div>

      {/* Promoted */}
      <div className="form-field checkbox-field">
        <div className="promoted-field">
          <label className="promoted-label">
            <input
              type="checkbox"
              name="isPromoted"
              checked={formData.isPromoted}
              onChange={handleChange}
            />
            Promoted
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
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
