import "../index.css";
import { useState } from "react";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ProjectsForm from "../forms/ProjectsForm";
import { updateProject, deleteProject } from "../api/projectsApi";
import useEdit from "../context/useEdit";

export function ProjectItem({
  id,
  title,
  techStack,
  summary,
  link,
  onRefresh,
}) {
  const { isEditValid } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const project = {
    title,
    techStack,
    summary,
    link,
  };
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleUpdate = async (updatedData) => {
    console.log("updated:", updatedData);
    try {
      await updateProject(id, updatedData);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }

    setIsEditing(false);
  };
  const handleDelete = async () => {
    try {
      await deleteProject(id);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  if (isEditing) {
    return (
      <div className="project-item">
        <div className="item-header">
          <div className="section-edit-title">EDIT PROJECT</div>
        </div>

        <ProjectsForm
          initialData={project}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="project-item">
      {isEditValid && (
        <div class="item-header">
          {" "}
          <EditButton onClick={handleEdit} />
          <DeleteButton onClick={handleDelete} />
        </div>
      )}

      <div className="project-header">
        <span className="project-title">{title}</span>
        <a
          className="project-link"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Project ↗
        </a>
      </div>
      <div className="project-tech">
        <span className="tech-label">Tech Stack:</span>
        <span className="tech-value">{techStack.join(", ")}</span>
      </div>
      <p className="project-summary">{summary}</p>
    </div>
  );
}
