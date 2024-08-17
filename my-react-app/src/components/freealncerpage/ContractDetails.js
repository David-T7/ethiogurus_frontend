import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock data for demonstration
const mockContractsData = {
  1: {
    id: 1,
    title: 'Web Development Contract',
    client: 'Client A',
    status: 'Pending',
    description: 'This contract involves the development of a full-stack web application.',
    deadline: '2024-09-01',
    projectFee: '$5000',
    terms: 'The freelancer agrees to deliver the project by the deadline. Payment will be released upon approval of the final deliverable.',
    milestones: [],
  },
  2: {
    id: 2,
    title: 'Mobile App Contract',
    client: 'Client B',
    status: 'Pending',
    description: 'Development of a cross-platform mobile application.',
    deadline: '2024-10-15',
    projectFee: '$8000',
    terms: 'The freelancer agrees to deliver the project by the deadline. Payment will be released upon approval of the final deliverable.',
    milestones: [
      { id: 1, title: 'Prototype', dueDate: '2024-09-01', amount: '$3000', status: 'Completed' },
      { id: 2, title: 'Final Product', dueDate: '2024-10-10', amount: '$5000', status: 'Pending' },
    ],
  },
  // Add more contracts here...
};

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Replace with API call to fetch contract details by ID
    setContract(mockContractsData[id]);
  }, [id]);

  const handleAccept = () => {
    // Replace with API call to accept the contract
  };

  const handleCounterOffer = () => {
    navigate(`/counter-offer/${id}`);
  };

  if (!contract) {
    return <div className="text-center py-8">Loading contract details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">{contract.title}</h1>
      <p className="mb-2">Client: {contract.client}</p>
      <p className="mb-2">Deadline: {contract.deadline}</p>
      <p className="mb-2">Project Fee: {contract.projectFee}</p>
      <p className="mb-6">Status: {contract.status}</p>
      <h2 className="text-2xl font-normal mb-4">Contract Details</h2>
      <p className="text-gray-700 mb-4">{contract.description}</p>
      <h3 className="text-xl font-normal mb-2">Terms & Conditions</h3>
      <p className="text-gray-700 mb-6">{contract.terms}</p>
      <h3 className="text-xl font-normal mb-2">Milestones</h3>
      <div className="border-t border-gray-200 pt-4">
        {contract.milestones.length ? (
          contract.milestones.map((milestone, index) => (
            <div key={milestone.id} className={`py-4 ${index < contract.milestones.length - 1 ? 'border-b border-gray-300' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-800">{milestone.title}</h4>
              </div>
              <p className="text-gray-600 mb-1">Due: {milestone.dueDate}</p>
              <p className="text-gray-600">Amount: {milestone.amount}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 mb-2">No milestones found for this contract.</p>
        )}
      </div>
      {contract.status === 'Pending' && (
        <div className="flex space-x-4">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Accept
          </button>
          <button
            onClick={handleCounterOffer}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"          >
            Counter Offer
          </button>
        </div>
      )}
    </div>
  );
};

export default ContractDetails;
