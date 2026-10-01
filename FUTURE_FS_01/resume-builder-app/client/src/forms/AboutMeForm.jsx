import { useState } from "react";
export default function AboutMeForm({ initialData, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    description: initialData.description,
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
      <div className="about-me-edit">
        <div className="form-field">
          <textarea
            value={initialData.description}
            name="description"
            onChange={handleChange}
            placeholder="Enter About Me"
          />
        </div>

        <button className="update-button" onClick={handleSubmit}>
          Update
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
