import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaProjectDiagram, FaPlus } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import getRelativeTime from '../../utils/getRelativeTime';
import { decryptToken } from "../../utils/decryptToken";

const fetchProjects = async () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const response = await axios.get('http://127.0.0.1:8000/api/projects/', {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the headers
    },
  });

  // Sort projects by creation date in descending order
  return response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const ClientDashboard = () => {
  const { data: projects = [], isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + projectsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 text-center">
        <p className="text-gray-600 text-lg">Loading your projects...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 text-center text-red-600">
        <p>Failed to load projects. {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {projects.length > 0 && (
        <header className="text-center mb-8">
          <p className="text-lg text-gray-600">
            Here’s a quick overview of your projects and activities.
          </p>
        </header>
      )}
       {/* Create Project Button */}
       <div className="text-center">
        <Link
          to="/create-project"
          className="inline-flex items-center gap-3 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg text-xl font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:scale-110"
        >
          <FaPlus className="text-2xl" /> Create Project
        </Link>
      </div>

      {/* Projects Highlights */}
      <div className="max-w-lg mx-auto p-6 mb-8">
        {projects.length > 0 && (
          <h2 className="text-blue-600 text-2xl mb-6 flex items-center gap-3">
            <FaProjectDiagram className="text-blue-600 text-2xl" /> Recent Projects
          </h2>
        )}
        {projects.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No projects found.</p>
        ) : (
          <ul className="space-y-4">
            {currentProjects.map((project) => (
              <Link
                to={`/projects/${project.id}`}
                key={project.id}
                className="block bg-gray-100 p-4 rounded-lg shadow-md border border-gray-300 transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <h3 className="text-xl font-normal text-brand-blue mb-2">{project.title}</h3>
                <p className="text-brand-blue mb-2">{project.description}</p>
                <span className="text-gray-500 text-sm">
                  {getRelativeTime(new Date(project.created_at).toLocaleDateString())}
                </span>
              </Link>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination Controls */}
      {projects.length > projectsPerPage && (
        <div className="flex justify-between items-center max-w-lg mx-auto mb-8">
          <button
            onClick={handleBack}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Back
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

     
    </div>
  );
};

export default ClientDashboard;