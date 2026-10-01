import "../index.css";
import WorkExperienceItem from "../cards/WorkExperienceItem";
import { useState, useEffect } from "react";
import {
  getWorkExperiences,
  createWorkExperience,
} from "../api/workExperienceApi";
import AddButton from "../components/AddButton.jsx";
import WorkExperienceForm from "../forms/WorkExperienceForm.jsx";
import useEdit from "../context/useEdit.js";

export default function WorkExperience() {
  const { isEditValid } = useEdit();
  const [experiences, setExperiences] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const fetchWorkExperience = async () => {
    try {
      const workExperience = await getWorkExperiences();
      setExperiences(workExperience);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = () => {
      fetchWorkExperience();
    };
    fetchData();
  }, []);

  const handleAdd = async (newWorkExperience) => {
    try {
      await createWorkExperience(newWorkExperience);
      await fetchWorkExperience();
    } catch (error) {
      console.error(error);
    }
    setShowAddForm(false);
  };

  return (
    <>
      <div className="work-experiences-card">
        <div className="section-header">
          <h4 className="section-title">WORK EXPERIENCE</h4>
          {isEditValid && (
            <AddButton onClick={() => setShowAddForm(true)}>
              Add Work Experience
            </AddButton>
          )}
        </div>

        <div>
          {experiences.map((experience) => (
            <WorkExperienceItem
              key={experience._id}
              id={experience._id}
              organization={experience.organization}
              roles={experience.roles}
              onRefresh={fetchWorkExperience}
            />
          ))}
        </div>

        {showAddForm && (
          <>
            <div className="item-header">
              <div className="section-edit-title">NEW WORK EXPERIENCE</div>
            </div>
            <WorkExperienceForm
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
