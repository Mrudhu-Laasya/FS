import "../index.css";
import { useState, useEffect } from "react";
import {
  getTechnicalSkills,
  getSoftSkills,
  createTechnicalSkill,
  createSoftSkill,
  deleteSoftSkill,
} from "../api/skillsApi";
import TechnicalSkillItem from "../cards/TechnicalSkillItem";
import AddButton from "../components/AddButton.jsx";
import TechnicalSkillsForm from "../forms/TechnicalSkillsForm.jsx";
import SoftSkillsForm from "../forms/SoftSkillsForm";
import useEdit from "../context/useEdit.js";

export default function Skills() {
  const { isEditValid } = useEdit();
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [showTechnicalAddForm, setShowTechnicalAddForm] = useState(false);
  const [showSoftSkillAddForm, setShowSoftSkillAddForm] = useState(false);
  const [softSkills, setSoftSkills] = useState([]);
  const fetchSkills = async () => {
    try {
      const technicalSkills = await getTechnicalSkills();
      setTechnicalSkills(technicalSkills);

      const softSkills = await getSoftSkills();
      setSoftSkills(softSkills);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      fetchSkills();
    };
    fetchData();
  }, []);
  const handleAddTechnicalSkill = async (newTechnicalSkills) => {
    try {
      await createTechnicalSkill(newTechnicalSkills);
      await fetchSkills();
    } catch (error) {
      console.error(error);
    }
    setShowTechnicalAddForm(false);
  };

  const handleAddSoftSkill = async (newSoftSkills) => {
    try {
      await createSoftSkill(newSoftSkills);
      await fetchSkills();
    } catch (error) {
      console.error(error);
    }
    setShowSoftSkillAddForm(false);
  };

  const handleDeleteSoftSkill = async (id) => {
    try {
      await deleteSoftSkill(id);
      await fetchSkills();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="professional-skills">
        <div className="technical-skills-card">
          <div className="section-header">
            <h4 className="section-title">TECHNICAL SKILLS</h4>
            {isEditValid && (
              <AddButton onClick={() => setShowTechnicalAddForm(true)}>
                Add Technical Skills
              </AddButton>
            )}
          </div>

          {technicalSkills.map((technicalSkill) => (
            <TechnicalSkillItem
              key={technicalSkill._id}
              id={technicalSkill._id}
              category={technicalSkill.category}
              skills={technicalSkill.skills}
              onRefresh={fetchSkills}
            />
          ))}

          {showTechnicalAddForm && (
            <>
              <div className="item-header">
                <div className="section-edit-title">NEW TECHNICAL SKILLS</div>
              </div>
              <TechnicalSkillsForm
                initialData={{}}
                onUpdate={handleAddTechnicalSkill}
                onCancel={() => setShowTechnicalAddForm(false)}
              />
            </>
          )}
        </div>
        <div className="soft-skills-card">
          <div className="section-header">
            <h4 className="section-title">SOFT SKILLS</h4>
            {isEditValid && (
              <AddButton onClick={() => setShowSoftSkillAddForm(true)}>
                Add Soft Skills
              </AddButton>
            )}
          </div>

          <div className="skill-list">
            {softSkills.map((softSkill) => (
              <span className="skill" key={softSkill._id}>
                {softSkill.skill}
                {isEditValid && (
                  <button
                    className="x-delete"
                    onClick={() => handleDeleteSoftSkill(softSkill._id)}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {showSoftSkillAddForm && (
            <>
              <div className="item-header">
                <div className="section-edit-title">NEW SOFT SKILLS</div>
              </div>
              <SoftSkillsForm
                initialData={{}}
                onUpdate={handleAddSoftSkill}
                onCancel={() => setShowSoftSkillAddForm(false)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
