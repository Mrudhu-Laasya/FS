import "../index.css";
import { useState, useEffect } from "react";
import { ProjectItem } from "../cards/ProjectItem";
import { getProjects, createProject } from "../api/projectsApi";
import AddButton from "../components/AddButton.jsx";
import ProjectsForm from "../forms/ProjectsForm.jsx";
import useEdit from "../context/useEdit.js";

export default function Projects() {
  const { isEditValid } = useEdit();
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const fetchProjects = async () => {
    try {
      const projectRes = await getProjects();
      setProjects(projectRes);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchProjects();
    };
    fetchData();
  }, []);
  const handleAdd = async (newProject) => {
    try {
      await createProject(newProject);
      await fetchProjects();
    } catch (error) {
      console.error(error);
    }

    setShowAddForm(false);
  };
  return (
    <>
      <div className="projects-card">
        <div className="section-header">
          <h4 className="section-title">PROJECTS</h4>
          {isEditValid && (
            <AddButton onClick={() => setShowAddForm(true)}>
              Add Projects
            </AddButton>
          )}
        </div>

        {projects.map((project) => (
          <ProjectItem
            key={project._id}
            id={project._id}
            title={project.title}
            techStack={project.techStack}
            summary={project.summary}
            link={project.link}
            onRefresh={fetchProjects}
          />
        ))}
        {showAddForm && (
          <>
            <div className="item-header">
              <div className="section-edit-title">NEW PROJECT</div>
            </div>
            <ProjectsForm
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
