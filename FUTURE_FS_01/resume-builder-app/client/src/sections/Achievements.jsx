import { useState, useEffect } from "react";
import "../index.css";
import AchievementItem from "../cards/AchievementItem.jsx";
import AddButton from "../components/AddButton.jsx";
import { getAchievements, createAchievement } from "../api/achievementsApi.js";
import AchievementsForm from "../forms/AchievementsForm.jsx";
import useEdit from "../context/useEdit.js";

export default function Achievements() {
  const { isEditValid } = useEdit();
  const [achievements, setAchievements] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const fetchAchievements = async () => {
    try {
      const achievementsRes = await getAchievements();
      setAchievements(achievementsRes);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchAchievements();
    };

    fetchData();
  }, []);

  const handleAdd = async (newAchievement) => {
    // POST API here
    try {
      await createAchievement(newAchievement);

      await fetchAchievements();
    } catch (error) {
      console.error(error);
    }
    setShowAddForm(false);
  };

  return (
    <>
      <div className="achievements-card">
        <div className="section-header">
          <h4 className="section-title">ACHIEVEMENTS</h4>
          {isEditValid && (
            <AddButton onClick={() => setShowAddForm(true)}>
              Add Achievements
            </AddButton>
          )}
        </div>

        {achievements.map((achievement) => (
          <>
            <AchievementItem
              key={achievement._id}
              id={achievement._id}
              title={achievement.title}
              category={achievement.category}
              description={achievement.description}
              url={achievement.url}
              onRefresh={fetchAchievements}
            />
          </>
        ))}
        {showAddForm && (
          <>
            <div className="item-header">
              <div className="section-edit-title">NEW ACHIEVEMENT</div>
            </div>
            <AchievementsForm
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
