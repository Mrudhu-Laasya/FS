import "../index.css";
import EducationItem from "../cards/EducationItem.jsx";
import { useState, useEffect } from "react";
import { getEducation, createEducation } from "../api/educationApi.js";
import AddButton from "../components/AddButton.jsx";
import EducationForm from "../forms/EducationForm.jsx";
import useEdit from "../context/useEdit";
export default function Education() {
  const { isEditValid } = useEdit();
  const [educationDetails, setEducationDetails] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const fetchEducation = async () => {
    try {
      const educationRes = await getEducation();
      setEducationDetails(educationRes);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = () => {
      fetchEducation();
    };
    fetchData();
  }, []);

  const handleAdd = async (newEducation) => {
    try {
      await createEducation(newEducation);
      await fetchEducation();
    } catch (error) {
      console.error(error);
    }

    setShowAddForm(false);
  };

  return (
    <>
      <div className="education-card">
        <div className="section-header">
          <h4 className="section-title">EDUCATION</h4>
          {isEditValid && (
            <AddButton onClick={() => setShowAddForm(true)}>
              Add Education
            </AddButton>
          )}
        </div>

        {educationDetails.map((educationDetail) => (
          <EducationItem
            key={educationDetail._id}
            id={educationDetail._id}
            degree={educationDetail.degree}
            field={educationDetail.field}
            college={educationDetail.college}
            score={educationDetail.score}
            duration={educationDetail.duration}
            onRefresh={fetchEducation}
          />
        ))}
        {showAddForm && (
          <>
            <div className="item-header">
              <div className="section-edit-title">EDUCATION DETAILS</div>
            </div>
            <EducationForm
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
