import { useState, useEffect } from "react";
import { getAboutMe } from "../api/aboutMeApi";
import EditButton from "../components/EditButton";
import "../index.css";
import AboutMeForm from "../forms/AboutMeForm";
import useEdit from "../context/useEdit";

export default function AboutMe() {
  const { isEditValid } = useEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [aboutMe, setAboutMe] = useState({});
  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const aboutMeRes = await getAboutMe();
        setAboutMe(aboutMeRes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAboutMe();
  }, []);
  const handleUpdate = (updatedData) => {
    console.log("Updated data:", updatedData);

    // PATCH API here

    setIsEditing(false);
  };

  return (
    <>
      <div className="about-me-card">
        {isEditValid && (
          <div class="item-header">
            {" "}
            <EditButton
              onClick={() => {
                setIsEditing(true);
              }}
            />
          </div>
        )}

        <h4 className="section-title">ABOUT ME</h4>
        {isEditing ? (
          <AboutMeForm
            initialData={aboutMe}
            onUpdate={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <p className="about-me-text">{aboutMe.description}</p>
        )}
      </div>
    </>
  );
}
