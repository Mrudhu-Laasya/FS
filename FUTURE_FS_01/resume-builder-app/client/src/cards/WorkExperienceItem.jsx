import "../index.css";
import { useState } from "react";
import RoleItem from "./RoleItem";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import {
  updateWorkExperience,
  deleteWorkExperience,
} from "../api/workExperienceApi";
import WorkExperienceForm from "../forms/WorkExperienceForm";
import useEdit from "../context/useEdit";

export default function WorkExperienceItem({
  id,
  organization,
  roles,
  onRefresh,
}) {
  const { isEditValid } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const workExperience = {
    organization,
    roles,
  };
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleUpdate = async (updatedData) => {
    console.log("updated:", updatedData);
    try {
      await updateWorkExperience(id, updatedData);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }

    setIsEditing(false);
  };
  const handleDelete = async () => {
    try {
      await deleteWorkExperience(id);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  if (isEditing) {
    return (
      <div className="work-experience-item">
        <div className="item-header">
          <div className="section-edit-title">EDIT WORK EXPERIENCE</div>
        </div>

        <WorkExperienceForm
          initialData={workExperience}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }
  return (
    <div className="work-experience-item">
      {isEditValid && (
        <div class="item-header">
          {" "}
          <EditButton onClick={handleEdit} />
          <DeleteButton onClick={handleDelete} />
        </div>
      )}

      <div className="work-company-header">
        <span className="work-organization">{organization}</span>
        {roles.length > 0 && (
          <span className="work-total-duration">
            {roles[roles.length - 1].startDate} – {roles[0].endDate}
          </span>
        )}
      </div>
      {roles.length > 0 && (
        <div className="work-roles">
          {roles.map((role, index) => (
            <RoleItem
              key={index}
              workExId={id}
              index={index}
              position={role.position}
              startDate={role.startDate}
              endDate={role.endDate}
              responsibilities={role.responsibilities}
              isPromoted={role.isPromoted}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
