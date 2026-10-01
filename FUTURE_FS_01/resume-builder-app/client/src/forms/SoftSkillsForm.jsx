import { useState } from "react";
export default function SoftSkillsForm({ initialData, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    skill: initialData.skill || "",
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
      <div className="soft-skills-edit">
        <div className="form-field">
          <input
            value={initialData.skill}
            name="skill"
            onChange={handleChange}
            placeholder="Enter Soft Skill"
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
