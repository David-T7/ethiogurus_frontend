import React, { useState, useEffect } from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// Mock data for demonstration
const mockProjectsData = {
  1: {
    id: 1,
    title: 'Web Development Project',
    description: 'A full-stack web development project.',
    status: 'Active',
    milestones: [],
  },
  2: {
    id: 2,
    title: 'Mobile App Development',
    description: 'Development of a cross-platform mobile application.',
    status: 'Completed',
    milestones: [
      { id: 1, title: 'Initial Setup', status: 'Completed', deadline: '2024-07-15', approvalRequested: true },
      { id: 2, title: 'Feature Development', status: 'Completed', deadline: '2024-08-15', approvalRequested: true },
    ],
  },
  3: {
    id: 3,
    title: 'E-commerce Platform',
    description: 'An e-commerce platform for online shopping.',
    status: 'In Dispute',
    milestones: [
      { id: 1, title: 'Design Phase', status: 'Completed', deadline: '2024-06-30', approvalRequested: true },
      { id: 2, title: 'Development Phase', status: 'In Progress', deadline: '2024-08-30', approvalRequested: false },
    ],
  },
  // Add more project data here...
};

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Replace with API call to fetch project details by ID
    setProject(mockProjectsData[id]);
  }, [id]);

  const requestApproval = (milestoneId) => {
    setProject((prevProject) => {
      const updatedMilestones = prevProject.milestones.map((milestone) =>
        milestone.id === milestoneId ? { ...milestone, approvalRequested: true } : milestone
      );
      return { ...prevProject, milestones: updatedMilestones };
    });
    // Replace with API call to request milestone approval
    alert(`Approval requested for milestone ID: ${milestoneId}`);
  };

  const requestProjectApproval = () => {
    // Replace with API call to request project approval
    alert('Approval requested for the entire project.');
  };

  const handleRespondToDispute = () => {
    navigate("/dispute-response/{id}")
  };

  if (!project) {
    return <div className="text-center py-8">Loading project details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <div className="flex items-center mb-4">
        <h1 className="text-3xl font-normal text-brand-dark-blue">{project.title}</h1>
        <span className={`ml-3 text-lg font-medium ${getProjectStatusStyle(project.status)}`}>
          ({project.status})
        </span>
      </div>
      <p className="text-gray-700 mb-6">{project.description}</p>

      {/* Respond to Dispute Button */}
      {project.status === 'In Dispute' && (
        <div className="mb-6">
          <p className="font-normal text-red-600 flex items-center">
            <FaExclamationTriangle className="mr-2" /> This project is currently in dispute.
          </p>
          <button
            onClick={handleRespondToDispute}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 mt-4"
          >
            Respond to Dispute
          </button>
        </div>
      )}

      {/* Approval Section for Projects without Milestones */}
      {project.milestones.length === 0 && (
        <div className="mb-6">
          <p className="font-normal">This project does not have any milestones. Please request approval for the entire project.</p>
          <button
            onClick={requestProjectApproval}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mt-4"
          >
            Request Approval
          </button>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-normal mb-4">Milestones</h2>
        {project.milestones.length ? (
          project.milestones.map((milestone) => (
            <div key={milestone.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
                <span
                  className={`text-xs font-semibold rounded-full px-4 py-1 ${getMilestoneStatusStyle(
                    milestone.status
                  )}`}
                  style={{ minWidth: '100px', textAlign: 'center' }}
                >
                  {milestone.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">Deadline: {milestone.deadline}</p>
              {!milestone.approvalRequested && milestone.status === 'Active' && (
                <button
                  onClick={() => requestApproval(milestone.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Request Approval
                </button>
              )}
              {milestone.approvalRequested && (
                <span className="text-green-600 flex items-center mt-2">
                  <FaCheckCircle className="mr-2" /> Approval Requested
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No milestones found for this project.</p>
        )}
      </div>
    </div>
  );
};

// Helper function to get milestone status styling
const getMilestoneStatusStyle = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-500 text-white';
    case 'Active':
      return 'bg-yellow-500 text-black';
    default:
      return 'bg-gray-300 text-black';
  }
};

// Helper function to get project status styling
const getProjectStatusStyle = (status) => {
  switch (status) {
    case 'Completed':
      return 'text-green-600';
    case 'Active':
      return 'text-blue-600';
    case 'In Dispute':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
};

export default ProjectDetails;
