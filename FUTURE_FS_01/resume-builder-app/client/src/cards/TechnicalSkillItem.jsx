import "../index.css";
import { useState } from "react";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import TechnicalSkillsForm from "../forms/TechnicalSkillsForm";
import { updateTechnicalSkill, deleteTechnicalSkill } from "../api/skillsApi";
import useEdit from "../context/useEdit";

export default function TechnicalSkillItem({
  id,
  category,
  skills,
  onRefresh,
}) {
  const { isEditValid } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const technicalSkills = {
    category,
    skills,
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateTechnicalSkill(id, updatedData);
      await onRefresh();
    } catch (error) {
      console.error(error);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteTechnicalSkill(id);
      await onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  if (isEditing) {
    return (
      <div className="technical-skills-item">
        <div className="item-header">
          <div className="section-edit-title">EDIT TECHNICAL SKILL</div>
        </div>

        <TechnicalSkillsForm
          initialData={technicalSkills}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="skill-category">
      <span className="skill-category-name">{category}</span>
      <div className="skill-list">
        {skills.map((skill, index) => (
          <span className="skill" key={index}>
            {skill}
          </span>
        ))}

        {isEditValid && (
          <div class="item-header">
            {" "}
            <EditButton onClick={handleEdit} />
            <DeleteButton onClick={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
}
