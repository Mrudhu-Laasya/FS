import "../index.css";
import { useState } from "react";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import HobbiesForm from "../forms/HobbiesForm";
import { updateHobby, deleteHobby } from "../api/hobbiesApi";
import useEdit from "../context/useEdit";

export default function HobbyItem({ id, title, description, onRefresh }) {
  const { isEditValid } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const hobby = {
    title,
    description,
  };
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleUpdate = async (updatedData) => {
    try {
      await updateHobby(id, updatedData);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }

    setIsEditing(false);
  };
  const handleDelete = async () => {
    try {
      await deleteHobby(id);

      await onRefresh();
    } catch (error) {
      console.error(error);
    }
  };
  if (isEditing) {
    return (
      <div className="hobby-item">
        <div className="item-header">
          <div className="section-edit-title">EDIT HOBBY</div>
        </div>

        <HobbiesForm
          initialData={hobby}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="hobby-item">
      {isEditValid && (
        <div class="item-header">
          {" "}
          <EditButton onClick={handleEdit} />
          <DeleteButton onClick={handleDelete} />
        </div>
      )}

      <div className="hobby-title">{title}</div>

      <p className="hobby-description">{description}</p>
    </div>
  );
}
