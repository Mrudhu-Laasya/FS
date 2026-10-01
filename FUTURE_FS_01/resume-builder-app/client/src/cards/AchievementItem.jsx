import { useState } from "react";
import "../index.css";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import AchievementsForm from "../forms/AchievementsForm";
import { updateAchievement, deleteAchievement } from "../api/achievementsApi";
import useEdit from "../context/useEdit";

export default function AchievementItem({
  id,
  title,
  category,
  description,
  url,
  onRefresh,
}) {
  const { isEditValid } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const achievement = {
    title,
    category,
    description,
    url,
  };

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleUpdate = async (updatedData) => {
    try {
      await updateAchievement(id, updatedData);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }
    setIsEditing(false);
  };
  const handleDelete = async () => {
    try {
      await deleteAchievement(id);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }
  };
  if (isEditing) {
    return (
      <div className="achievement-item">
        <div className="item-header">
          <div className="section-edit-title">EDIT ACHIEVEMENT</div>
        </div>

        <AchievementsForm
          initialData={achievement}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }
  return (
    <>
      <div className="achievement-item">
        {isEditValid && (
          <div class="item-header">
            {" "}
            <EditButton onClick={handleEdit} />
            <DeleteButton onClick={handleDelete} />
          </div>
        )}
        <div className="achievement-header">
          <span className="achievement-title">{title}</span>

          <span className="achievement-category">{category}</span>
        </div>

        <p className="achievement-description">{description}</p>

        {url && (
          <a
            className="achievement-link"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Publication ↗
          </a>
        )}
      </div>
    </>
  );
}
