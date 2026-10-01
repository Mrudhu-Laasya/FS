import "../index.css";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import RoleForm from "../forms/RoleForm";
import { useState } from "react";
import { updateRole, deleteRole } from "../api/workExperienceApi";
import useEdit from "../context/useEdit";

export default function RoleItem({
  workExId,
  index,
  position,
  startDate,
  endDate,
  responsibilities,
  isPromoted,
  onRefresh,
}) {
  const { isEditValid } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const role = {
    position,
    startDate,
    endDate,
    responsibilities,
    isPromoted,
  };
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleUpdate = async (updatedData) => {
    console.log("Updated data:", updatedData);

    try {
      await updateRole(workExId, index, updatedData);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }

    setIsEditing(false);
  };
  const handleDelete = async () => {
    try {
      await deleteRole(workExId, index);
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

        <RoleForm
          initialData={role}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }
  return (
    <div className="work-role">
      {isEditValid && (
        <div class="item-header">
          {" "}
          <EditButton onClick={handleEdit} />
          <DeleteButton onClick={handleDelete} />
        </div>
      )}
      <div className="work-role-header">
        <div>
          <span className="work-position">{position}</span>

          {isPromoted && <span className="promotion-badge">PROMOTED</span>}
        </div>

        <span className="work-duration">
          {startDate} – {endDate}
        </span>
      </div>

      <ul className="work-responsibilities">
        {responsibilities.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
