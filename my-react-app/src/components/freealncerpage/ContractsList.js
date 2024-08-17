import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Mock data for demonstration
const mockContractsData = [
  {
    id: 1,
    title: 'Web Development Contract',
    client: 'Client A',
    status: 'Pending',
    deadline: '2024-09-01',
    projectFee: '$5000',
    milestones: [
      { id: 1, title: 'Design Phase', dueDate: '2024-08-15', amount: '$2000', status: 'Pending' },
      { id: 2, title: 'Development Phase', dueDate: '2024-08-30', amount: '$3000', status: 'Pending' },
    ],
  },
  {
    id: 2,
    title: 'Mobile App Contract',
    client: 'Client B',
    status: 'Pending',
    deadline: '2024-10-15',
    projectFee: '$8000',
    milestones: [
      { id: 1, title: 'Prototype', dueDate: '2024-09-01', amount: '$3000', status: 'Completed' },
      { id: 2, title: 'Final Product', dueDate: '2024-10-10', amount: '$5000', status: 'Pending' },
    ],
  },
  // Add more contracts here...
];

const ContractsList = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    // Replace with API call to fetch contracts for the freelancer
    setContracts(mockContractsData);
  }, []);

  if (contracts.length === 0) {
    return <div className="text-center py-8">No contracts found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Contracts</h1>
      {contracts.map((contract) => (
        <div key={contract.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{contract.title}</h3>
            <span className={`text-xs font-semibold rounded-full px-4 py-1 ${getContractStatusStyle(contract.status)}`}>
              {contract.status}
            </span>
          </div>
          <p className="text-gray-600">Client: {contract.client}</p>
          <p className="text-gray-600">Deadline: {contract.deadline}</p>
          <p className="text-gray-600">Project Fee: {contract.projectFee}</p>
          <Link to={`/mycontracts/${contract.id}`} className="text-blue-500 hover:underline mt-4 inline-block">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

// Helper function to get contract status styling
const getContractStatusStyle = (status) => {
  switch (status) {
    case 'Accepted':
      return 'bg-green-500 text-white';
    case 'Pending':
      return 'bg-yellow-500 text-black';
    case 'Rejected':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
};

export default ContractsList;
