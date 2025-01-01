import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';

const fetchRecentProjects = async () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

  if (!token) {
    throw new Error("No valid token found.");
  }

  const response = await axios.get('http://127.0.0.1:8000/api/freelancer-projects/', {
    headers: {
      Authorization: `Bearer ${token}`, // Include the decrypted token in the headers
    },
  });

  // Sort projects by creation date in descending order (latest first)
  return response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const FreelancerDashboard = () => {
  const { data: allProjects = [], isLoading, isError } = useQuery({
    queryKey: ['recentProjects'],
    queryFn: fetchRecentProjects,
  });

  const projectsPerPage = 3; // Projects to display per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalProjects = allProjects.length;
  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  // Calculate projects to display on the current page
  const startIndex = (currentPage - 1) * projectsPerPage;
  const currentProjects = allProjects.slice(startIndex, startIndex + projectsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading recent projects...</div>;
  }

  if (isError) {
    return <div className="text-center py-8">Failed to load recent projects. Please try again later.</div>;
  }

  if (!totalProjects) {
    return <div className="text-center py-8">No recent projects found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-8 text-brand-dark-blue text-center">Recent Projects</h1>
      <div className="p-6">
        {currentProjects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-normal text-brand-blue">{project.title}</h3>
              <span className={`px-3 py-1 text-xs font-normal rounded-full ${getStatusStyle(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Deadline: {project.deadline ? project.deadline : 'Not Specified'}
            </p>
            <Link
              to={`/myprojects/${project.id}`}
              className="text-blue-600 hover:underline flex items-center"
            >
              <FaCheckCircle className="mr-2" /> Show Details
            </Link>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-8">
          <button
            onClick={handleBack}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Back
          </button>
          <span className="text-sm font-normal">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to get status styling
const getStatusStyle = (status) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500 text-white';
    case 'Completed':
      return 'bg-blue-500 text-white';
    case 'Pending':
      return 'bg-yellow-500 text-black';
    default:
      return 'bg-gray-300 text-black';
  }
};

export default FreelancerDashboard;
