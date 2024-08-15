import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaProjectDiagram, FaPlus } from 'react-icons/fa';
import getRelativeTime from "../../utils/getRelativeTime"
const ClientDashboard = () => {
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    // Sample recent projects data
    const sampleProjects = [
      {
        id: 1,
        title: 'Website Redesign',
        description: 'Redesign the company website with a modern look and improved user experience.',
        date: '2024-08-10T14:20:00Z'
      },
      {
        id: 2,
        title: 'Mobile App Development',
        description: 'Develop a new mobile app for our e-commerce platform with integrated payment systems.',
        date: '2024-08-05T10:00:00Z'
      },
      {
        id: 3,
        title: 'SEO Optimization',
        description: 'Optimize the website for search engines to improve visibility and drive traffic.',
        date: '2024-07-30T09:15:00Z'
      },
      {
        id: 4,
        title: 'Marketing Campaign',
        description: 'Plan and execute a new marketing campaign to increase brand awareness and customer engagement.',
        date: '2024-07-25T11:45:00Z'
      }
    ];

    setRecentProjects(sampleProjects);
  }, []);


  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <header className="text-center mb-8">
        <p className="text-lg text-gray-600">
          Here’s a quick overview of your recent projects and activities.
        </p>
      </header>

      {/* Recent Projects Highlights */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg border  border-gray-200 p-6 mb-8">
        <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3 text-gray-800">
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
                <span className="text-gray-500 text-sm">{getRelativeTime(project.date)}</span>
              </Link>
            ))}
          </ul>
        )}
      </div>

      {/* Create Project Button */}
      <div className="text-center">
        <Link to="/create-project" className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg text-xl font-semibold transition-all duration-300 hover:bg-blue-700 hover:shadow-xl">
          <FaPlus className="text-2xl" /> Create Project
        </Link>
      </div>
    </div>
  );
};

export default ClientDashboard;
