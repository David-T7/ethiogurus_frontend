import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

// Mock data for demonstration
const mockFreelancerProjects = [
  {
    id: 1,
    title: 'Web Development Project',
    description: 'A full-stack web development project.',
    status: 'Active',
    deadline: '2024-09-01',
  },
  {
    id: 2,
    title: 'Mobile App Development',
    description: 'Development of a cross-platform mobile application.',
    status: 'Completed',
    deadline: '2024-08-15',
  },
  {
    id: 3,
    title: 'Django Project',
    description: 'A Django-based project with multiple milestones.',
    status: 'Pending',
    deadline: '2024-09-20',
  },
  // Add more project data here...
];

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Replace with an API call to fetch projects associated with the freelancer
    setProjects(mockFreelancerProjects);
  }, []);

  if (!projects.length) {
    return <div className="text-center py-8">No projects found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-8 text-brand-dark-blue text-center">My Projects</h1>
      <div className="p-6">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">Deadline: {project.deadline}</p>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <Link
              to={`/myprojects/${project.id}`}
              className="text-blue-600 hover:underline flex items-center"
            >
              <FaCheckCircle className="mr-2" /> View Details
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
      return 'bg-blue-500 text-white';
    case 'Completed':
      return 'bg-green-500 text-white';
    case 'Pending':
      return 'bg-yellow-500 text-black';
    default:
      return 'bg-gray-300 text-black';
  }
};

export default ProjectListPage;
