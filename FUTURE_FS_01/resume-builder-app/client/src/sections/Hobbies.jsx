import { useState, useEffect } from "react";
import HobbyItem from "../cards/HobbyItem";
import { getHobbies, createHobby } from "../api/hobbiesApi";
import AddButton from "../components/AddButton.jsx";
import HobbiesForm from "../forms/HobbiesForm.jsx";
import useEdit from "../context/useEdit.js";

export default function Hobbies() {
  const { isEditValid } = useEdit();
  const [hobbies, setHobbies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const fetchHobbies = async () => {
    try {
      const hobbyRes = await getHobbies();
      setHobbies(hobbyRes);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = () => {
      fetchHobbies();
    };
    fetchData();
  }, []);

  const handleAdd = async (newHobby) => {
    try {
      await createHobby(newHobby);
      await fetchHobbies();
    } catch (error) {
      console.error(error);
    }

    setShowAddForm(false);
  };
  return (
    <>
      <div className="hobbies-card">
        <div className="section-header">
          <h4 className="section-title">HOBBIES</h4>
          {isEditValid && (
            <AddButton onClick={() => setShowAddForm(true)}>
              Add Hobbies
            </AddButton>
          )}
        </div>

        {hobbies.map((hobby) => (
          <HobbyItem
            key={hobby._id}
            id={hobby._id}
            title={hobby.title}
            description={hobby.description}
            onRefresh={fetchHobbies}
          />
        ))}

        {showAddForm && (
          <>
            <div className="item-header">
              <div className="section-edit-title">NEW HOBBY</div>
            </div>
            <HobbiesForm
              initialData={{}}
              onUpdate={handleAdd}
              onCancel={() => setShowAddForm(false)}
            />
          </>
        )}
      </div>
    </>
  );
}
