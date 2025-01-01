// ProjectSelectionPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProjectSelectionPage = ({ projects, freelancerID }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  const [freelancer_id , setFreelancerID ] = useState(null)
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  useEffect(() => {
    // Set freelancer ID and update loading state
    if (freelancerID) {
      setFreelancerID(freelancerID)
    }
  }, [freelancerID]);

  const handleConfirm = () => {
    if (selectedProject) { // Only confirm if not loading
      navigate(`/projects/${selectedProject.id}/create-contract`, {
        state: { freelancerID: freelancer_id }, // Pass freelancerID in state
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-6 text-brand-dark-blue">Select a Project</h1>
      <div className="flex justify-end items-center mb-8">
        <Link to="/create-project" className="inline-flex items-center gap-3  py-2 px-4 bg-blue-600 text-white rounded-lg shadow-lg text-xl font-semibold transition-transform duration-300 transform hover:scale-105 hover:bg-blue-700 hover:shadow-xl">
          <FaPlus className="text-2xl" /> Create Project
        </Link>
        </div>
      <ul className="space-y-4">
        {projects.map((project) => (
          <li
            key={project.id}
            onClick={() => handleProjectSelect(project)}
            className={`p-6 border rounded-lg cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105 ${
              selectedProject && selectedProject.id === project.id
                ? 'bg-blue-50 border-blue-500'
                : 'border-gray-300'
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-900">{project.name}</h2>
            <p className="text-gray-600 mt-2">{project.description}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleConfirm}
          disabled={!selectedProject}
          className="bg-blue-500 w-[50%] text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default ProjectSelectionPage;
