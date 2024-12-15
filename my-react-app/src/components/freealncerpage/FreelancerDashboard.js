import React from 'react';
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
  const sortedProjects = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Return the top 5 most recent projects
  return sortedProjects.slice(0, 5);
};

const FreelancerDashboard = () => {
  const { data: recentProjects = [], isLoading, isError } = useQuery({
    queryKey: ['recentProjects'],
    queryFn: fetchRecentProjects,
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading recent projects...</div>;
  }

  if (isError) {
    return <div className="text-center py-8">Failed to load recent projects. Please try again later.</div>;
  }

  if (!recentProjects.length) {
    return <div className="text-center py-8">No recent projects found.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-8 text-brand-dark-blue text-center">Recent Projects</h1>
      <div className="p-6">
        {recentProjects.map((project) => (
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
