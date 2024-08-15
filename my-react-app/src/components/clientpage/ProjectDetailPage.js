import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import ClientLayout from './ClientLayoutPage';

const ProjectDetailPage = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const navigate = useNavigate();

  // Dummy data (replace with actual API call)
  const project = {
    title: 'Website Redesign',
    description: 'Redesign the company website with a modern look and feel.',
    status: 'In Progress',
    createdAt: '2024-08-01',
    freelancers: [
      {
        id: 1,
        name: 'John Doe',
        profilePic: null, // Replace with actual profile picture URL
        role: 'Frontend Developer',
      },
      {
        id: 2,
        name: 'Jane Smith',
        profilePic: null, // Replace with actual profile picture URL
        role: 'Backend Developer',
      },
    ],
    milestones: [
      {
        id: 1,
        title: 'Initial Design',
        completed: true,
        deadline: '2024-08-15',
      },
      {
        id: 2,
        title: 'Prototype Development',
        completed: false,
        deadline: '2024-09-01',
      },
      {
        id: 3,
        title: 'Final Testing & Deployment',
        completed: false,
        deadline: '2024-09-15',
      },
    ],
    progress: 40, // Completion percentage
  };

  const handleCreateDispute = () => {
    navigate(`/projects/${projectId}/dispute`);
  };

  const handleApproveMilestone = (milestoneId) => {
    console.log('Milestone Approved:', milestoneId);
    // Simulate milestone approval
  };

  const handlePayMilestone = (milestoneId) => {
    console.log('Payment Made for Milestone:', milestoneId);
    // Simulate milestone payment
  };

  const handleContactFreelancer = (freelancerId) => {
    navigate(`/contact/${freelancerId}`);
  };

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto p-6 mt-6 bg-brand-gray-light shadow-lg rounded-lg border border-gray-300">
        <h1 className="text-4xl font-thin text-brand-blue mb-6 text-center">
          {project.title}
        </h1>

        <div className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-2">Project Details</h2>
          <p className="text-gray-700 mb-4">{project.description}</p>
          <div
            className={`inline-block px-4 py-1 rounded-full text-white ${
              project.status === 'Completed'
                ? 'bg-brand-green'
                : project.status === 'In Progress'
                ? 'bg-brand-orange'
                : 'bg-brand-gray-dark'
            }`}
          >
            {project.status}
          </div>
          <span className="block mt-2 text-sm text-gray-700">Created on: {project.createdAt}</span>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-brand-gray-dark mb-4">Freelancers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.freelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                className="flex items-center p-4 bg-brand-gray-light text-brand-gray-dark rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                {freelancer.profilePic ? (
                  <img
                    src={freelancer.profilePic}
                    alt={`${freelancer.name}'s profile`}
                    className="w-12 h-12 rounded-full border-2 border-brand-blue"
                  />
                ) : (
                  <FaUserCircle className="w-12 h-12 text-brand-dark-blue" />
                )}
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold">{freelancer.name}</h3>
                  <p className="text-sm">{freelancer.role}</p>
                </div>
                <button
                  onClick={() => handleContactFreelancer(freelancer.id)}
                  className="bg-brand-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark-blue transition-transform transform hover:scale-105 shadow-md"
                >
                  Contact
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-brand-gray-dark mb-4">Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-6 rounded-lg shadow-md bg-brand-gray-light text-brand-gray-dark"
              >
                <h3 className="text-lg font-bold mb-2">{milestone.title}</h3>
                <p className="mb-4">
                  {milestone.completed ? 'Completed' : 'In Progress'}
                </p>
                {milestone.completed ? (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleApproveMilestone(milestone.id)}
                      className="bg-brand-green text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-md"
                    >
                      Approve
                    </button>

                  </div>
                ) : (
                  <p className="text-sm text-red-600">Deadline: {milestone.deadline}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-brand-gray-dark mb-2">Project Completion</h2>
          <div className="relative w-full h-6 bg-brand-gray-light rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full ${project.progress < 50 ? 'bg-brand-orange' : 'bg-brand-green'} transition-all duration-500 ease-in-out`}
              style={{ width: `${project.progress}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-brand-gray-dark">
              {project.progress}%
            </span>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ProjectDetailPage;
