import { useState } from "react";

export default function ProjectsForm({ initialData, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    techStack: initialData.techStack || [],
    summary: initialData.summary || "",
    link: initialData.link || "",
  });

  const [techStackInput, setTechStackInput] = useState(
    (initialData.techStack || []).join(", "),
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const updatedTechStack = techStackInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const updatedData = {
      ...formData,
      techStack: updatedTechStack,
    };

    console.log("Updated data:", updatedData);

    onUpdate(updatedData);
  };

  return (
    <>
      <div className="project-edit-form">
        <div className="form-field">
          <label>Title</label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project title"
          />
        </div>

        <div className="form-field">
          <label>Tech Stack</label>

          <input
            type="text"
            name="techStack"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            placeholder="React, Node.js, MongoDB"
          />
        </div>

        <div className="form-field">
          <label>Summary</label>

          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Enter Project Summary"
          />
        </div>

        <div className="form-field">
          <label>Project Link</label>

          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://github.com"
          />
        </div>

        <div className="project-form-actions">
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
