import { useState } from "react";
export default function TechnicalSkillsForm({
  initialData,
  onUpdate,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    category: initialData.category || "",
    skills: initialData.skills || [],
  });
  const [technicalSkills, setTechnicalSkills] = useState(
    (initialData.skills || []).join(", "),
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    const updatedTechnicalSkills = technicalSkills
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const updatedData = {
      ...formData,
      skills: updatedTechnicalSkills,
    };
    console.log(updatedData);
    onUpdate(updatedData);
  };
  return (
    <>
      <div className="technical-skills-edit-form">
        <div className="form-field">
          <label>Category</label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter Category"
          />
        </div>

        <div className="form-field">
          <label>Skills</label>

          <input
            type="text"
            name="skills"
            value={technicalSkills}
            onChange={(e) => {
              setTechnicalSkills(e.target.value);
            }}
            placeholder="Java, JavaScript, Python, Go, SQL"
          />
        </div>
        <div className="technical-skills-form-actions">
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
