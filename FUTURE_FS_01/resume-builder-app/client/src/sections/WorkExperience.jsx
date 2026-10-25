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

const parseMonthYear = (dateString) => {
  if (!dateString) return new Date(0); // Return epoch if empty
  
  const months = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11
  };
  
  const parts = dateString.trim().split(' ');
  const month = months[parts[0].toLowerCase()];
  const year = parseInt(parts[1]);
  
  return new Date(year, month || 0, 1);
};

export default function WorkExperience() {
  const { isEditValid } = useEdit();
  const [experiences, setExperiences] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const fetchWorkExperience = async () => {
    try {
      const workExperience = await getWorkExperiences();
        // Sort by most recent first (descending order)
    const sortedExperience = [...workExperience].sort((a, b) => {
      const aStart = a.roles[a.roles.length - 1]?.startDate || '';
      const bStart = b.roles[b.roles.length - 1]?.startDate || '';
      return parseMonthYear(bStart) - parseMonthYear(aStart);
    });
      setExperiences(sortedExperience);
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
