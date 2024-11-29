import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaSpinner, FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import ClientLayout from './ClientLayoutPage';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const fetchProjects = async () => {
  const token = localStorage.getItem('access');
  const response = await axios.get('http://127.0.0.1:8000/api/user/projects/', {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Extract and map project data for display
  return response.data.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    createdAt: new Date(project.created_at).toLocaleDateString(),
  }));
};

const ProjectsPage = () => {
  const navigate = useNavigate();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

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

        {isLoading ? (
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-3xl text-brand-blue" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 text-center">
            You have no projects. Click "Create Project" to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-8 cursor-pointer">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="bg-brand-gray p-6 rounded-lg shadow-lg text-brand-blue border border-gray-300 hover:bg-brand-blue hover:text-white transition-all transform hover:scale-105"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl">{project.title}</h3>
                    <p className="text-sm mt-2">{project.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`${
                      project.status === 'Completed'
                        ? 'text-green-600 bg-gray-200'
                        : project.status === 'In Progress'
                        ? 'text-yellow-600 bg-gray-200'
                        : 'text-brand-blue bg-gray-200'
                    } font-semibold px-3 py-1 rounded-full`}
                  >
                    {project.status}
                  </span>
                  <span className="text-sm">Created On: {project.createdAt}</span>
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
