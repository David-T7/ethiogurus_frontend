import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const FreelancerDashboard = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const token = localStorage.getItem('access'); // Get the access token from localStorage
        const response = await axios.get('http://127.0.0.1:8000/api/freelancer-projects/', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });

        // Sort projects by creation date in descending order (latest first)
        const sortedProjects = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Select the top 5 most recent projects
        setRecentProjects(sortedProjects.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch recent projects:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading recent projects...</div>;
  }

  if (error) {
    return <div className="text-center py-8">Failed to load recent projects. Please try again later.</div>;
  }

  if (!recentProjects.length) {
    return <div className="text-center py-8">No recent projects found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-8 text-brand-dark-blue text-center">Recent Projects</h1>
      <div className="p-6">
        {recentProjects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">Deadline: {project.deadline}</p>
            <Link
              to={`/projects/${project.id}`}
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
