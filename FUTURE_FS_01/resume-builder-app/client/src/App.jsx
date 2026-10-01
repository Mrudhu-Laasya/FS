import "./index.css";
import profilePic from "./assets/linkedin_pro_pic.jpeg";
import { useState } from "react";
import html2pdf from "html2pdf.js";
import AboutMe from "./sections/AboutMe";
import Education from "./sections/Education";
import WorkExperience from "./sections/WorkExperience";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Achievements from "./sections/Achievements";
import Certifications from "./sections/Certifications";
import Hobbies from "./sections/Hobbies";
import ResumeHeader from "./sections/ResumeHeader";
import LoginForm from "./forms/LoginForm";
import { logoutUser } from "./api/authApi";
import useEdit from "./context/useEdit";

function App() {
  const { isEditValid, setIsEditValid } = useEdit();
  const [isEdit, setIsEdit] = useState(false);
  const handleEditSuccess = () => {
    setIsEdit(false);
  };
  const handleLogout = async () => {
    try {
      const data = await logoutUser();
      console.log(data.message);
      setIsEdit(false);
      setIsEditValid(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveAsPDF = () => {
    console.log("Save as PDF clicked");
    const element = document.querySelector("body");
    console.log("Body element:", element);

    if (!element) {
      console.error("Body element not found");
      return;
    }

    const opt = {
      margin: 0.2,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.92 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        console.log("PDF saved successfully");
      })
      .catch((err) => {
        console.error("Error saving PDF:", err);
      });
  };
  return isEdit ? (
    <LoginForm onUpdate={handleEditSuccess} />
  ) : (
    <>
      <header className="resume-header">
        <div>
          <img
            src={profilePic}
            alt="profile picture"
            height="150"
            width="150"
          />
        </div>
        <ResumeHeader />
        <div className="header-buttons">
          <button className="save-pdf-btn" onClick={handleSaveAsPDF}>
            Save as PDF
          </button>
          {isEditValid ? (
            <button className="edit-resume-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              className="edit-resume-btn"
              onClick={() => {
                setIsEdit(true);
              }}
            >
              Edit Resume
            </button>
          )}
        </div>
      </header>
      <div className="resume">
        <div className="resume-top-grid">
          <AboutMe editMode={isEdit} />
          <Skills />
        </div>
        <WorkExperience />
        <Projects />
        <Education />
        <div className="resume-bottom-grid">
          <Achievements />
          <Certifications />
          <Hobbies />
        </div>
      </div>
    </>
  );
}

export default App;
