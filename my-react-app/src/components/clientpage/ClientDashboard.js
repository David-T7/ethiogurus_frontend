import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaProjectDiagram, FaPlus } from 'react-icons/fa';
import getRelativeTime from "../../utils/getRelativeTime"
import axios from 'axios';
const ClientDashboard = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const token = localStorage.getItem('access'); // Get the access token from localStorage
        const response = await axios.get('http://127.0.0.1:8000/api/projects/', {
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

  

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <header className="text-center mb-8">
        <p className="text-lg text-gray-600">
          Here’s a quick overview of your recent projects and activities.
        </p>
      </header>

      {/* Recent Projects Highlights */}
      <div className="max-w-3xl mx-auto p-6 mb-8">
        <h2 className="text-blue-600 text-2xl mb-6 flex items-center gap-3">
          <FaProjectDiagram className="text-blue-600 text-2xl" />
          Recent Projects
        </h2>
        {recentProjects.length === 0 ? (
          <p className="text-gray-600 text-center">No recent projects.</p>
        ) : (
          <ul className="space-y-4">
            {recentProjects.map((project) => (
              <Link
                to={`/projects/${project.id}`} // Adjust the route to match your project detail page
                key={project.id}
                className="block bg-gray-100 p-4 rounded-lg shadow-md border  border-gray-300 transition-transform transform hover:scale-105 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-2">{project.description}</p>
                <span className="text-gray-500 text-sm">{getRelativeTime(new Date(project.created_at).toLocaleDateString())}</span>
              </Link>
            ))}
          </ul>
        )}
      </div>

      {/* Create Project Button */}
      <div className="text-center">
        <Link to="/create-project" className="inline-flex items-center gap-3 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg text-xl font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-xl">
          <FaPlus className="text-2xl" /> Create Project
        </Link>
      </div>
    </div>
  );
};

export default ClientDashboard;
