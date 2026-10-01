import { useState } from "react";
import "../index.css";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import EducationForm from "../forms/EducationForm";
import { updateEducation, deleteEducation } from "../api/educationApi";
import useEdit from "../context/useEdit";

export default function EducationItem({
  id,
  degree,
  field,
  college,
  score,
  duration,
  onRefresh,
}) {
  const { isEditValid } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const education = {
    degree,
    field,
    college,
    score,
    duration,
  };
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateEducation(id, updatedData);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteEducation(id);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  if (isEditing) {
    return (
      <div className="education-item">
        <div className="item-header">
          <div className="section-edit-title">EDIT CERTIFICATE</div>
        </div>

        <EducationForm
          initialData={education}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="education-item">
      {isEditValid && (
        <div class="item-header">
          {" "}
          <EditButton onClick={handleEdit} />
          <DeleteButton onClick={handleDelete} />
        </div>
      )}
      <span className="education-degree">
        <span className="degree-name">
          {degree}
          {field && ` in ${field}`}
        </span>
      </span>
      <div className="education-college">
        <span> {college}</span>
      </div>
      <div className="education-meta">
        {score.type === "CGPA" ? (
          <span className="education-cgpa">CGPA: {score.value}</span>
        ) : (
          <span className="education-cgpa">Percentage: {score.value}%</span>
        )}
        <span className="education-duration">{duration} </span>
      </div>
    </div>
  );
}
