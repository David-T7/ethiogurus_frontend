import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import { FaSpinner, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import ClientLayout from './ClientLayoutPage';
import { useNavigate, Link } from 'react-router-dom';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/user/projects/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extract relevant fields from the response and set the projects state
        const fetchedProjects = response.data.map((project) => (

          {
          id: project.id, // Assuming each project has a unique identifier
          title: project.title,
          description: project.description,
          status: project.status === 'open' ? 'In Progress' : project.status, // Convert status if necessary
          createdAt: new Date(project.created_at).toLocaleDateString(), // Format date for display
        }));
        setProjects(fetchedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  const handleProjectClick = (id) => {
    navigate(`/projects/${id}`);
  };

  const handleEditProject = (projectId) => {
    navigate(`/project/${projectId}/edit`);
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-thin text-brand-blue mb-8 text-center">Your Projects</h1>

        <div className="flex justify-end items-center mb-8">
          <Link
            to="/create-project"
            className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg text-xl font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-xl"
          >
            <FaPlus className="text-2xl" /> Create Project
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-3xl text-brand-blue" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-center">You have no projects. Click "New Project" to get started.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 cursor-pointer">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="bg-brand-gray p-6 rounded-lg shadow-lg text-gray-700 border border-gray-300 hover:bg-brand-blue hover:text-white transition-all transform hover:scale-105"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-semibold">{project.title}</h3>
                    <p className="text-sm mt-2">{project.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`${
                      project.status === 'Completed'
                        ? 'text-green-600 bg-green-100'
                        : project.status === 'In Progress'
                        ? 'text-yellow-600 bg-yellow-100'
                        : 'text-gray-400 bg-gray-100'
                    } font-semibold px-3 py-1 rounded-full`}
                  >
                    {project.status}
                  </span>
                  <span className="text-sm">{project.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ProjectsPage;
