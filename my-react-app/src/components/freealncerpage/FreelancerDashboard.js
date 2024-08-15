import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

// Mock data for demonstration
const mockFreelancerData = {
  contracts: [
    { id: 1, title: 'Web Development Project', status: 'Active', deadline: '2024-09-01', created_at: '2024-08-01' },
    { id: 2, title: 'Mobile App Development', status: 'Completed', deadline: '2024-08-15', created_at: '2024-07-15' },
    { id: 3, title: 'Django Project', status: 'Pending', deadline: '2024-09-20', created_at: '2024-08-05' },
    { id: 4, title: 'UI/UX Design', status: 'Active', deadline: '2024-08-10', created_at: '2024-07-25' },
  ],
};

const FreelancerDashboard = () => {
  const [recentContracts, setRecentContracts] = useState([]);

  useEffect(() => {
    // Sort contracts by creation date in descending order (latest first)
    const sortedContracts = [...mockFreelancerData.contracts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Select the top 5 most recent contracts (you can adjust this number as needed)
    setRecentContracts(sortedContracts.slice(0, 5));
  }, []);

  if (!recentContracts.length) {
    return <div className="text-center py-8">No recent projects found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8 ">
      <h1 className="text-5xl font-thin mb-8 text-brand-dark-blue text-center">Recent Projects</h1>

      <div className="p-6">
        {recentContracts.map(contract => (
          <div key={contract.id} className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{contract.title}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(contract.status)}`}>
                {contract.status}
              </span>
            </div>
            <p className="text-gray-600 mb-4">Deadline: {contract.deadline}</p>
            <Link
              to={`/projects/${contract.id}`}
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
