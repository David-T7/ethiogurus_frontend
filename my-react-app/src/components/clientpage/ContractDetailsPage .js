import React, { useState, useEffect } from 'react';
import { useParams , useNavigate  } from 'react-router-dom';
import { FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const mockContractData = {
  id: 1,
  projectFee: 1000,
  contractTerms: "This is a sample contract term.",
  isMilestoneBased: true,
  milestones: [
    { title: 'Initial Payment', deadline: '2024-08-30', amount: 500 },
    { title: 'Final Payment', deadline: '2024-09-30', amount: 500 },
  ],
};

const ContractDetailsPage = () => {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    // Simulate fetching contract details
    setContract(mockContractData);
  }, [contractId]);

  const handleUpdate = (id) => {
    navigate("/contracts/{id}/edit")
  };

  const handleTerminate = () => {
    console.log('Contract terminated:', contractId);
    // Simulate contract termination
  };

  const handleDispute = () => {
    console.log('Dispute initiated:', contractId);
    // Simulate initiating a dispute
  };

  if (!contract) return <div>Loading...</div>;

  const sortedMilestones = [...contract.milestones].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-6 text-brand-dark-blue">Contract Details</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Fee</h2>
          <p className="text-gray-600">{contract.projectFee}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contract Terms</h2>
       
          <p className="text-gray-600">{contract.contractTerms}</p>
      </div>

      {contract.isMilestoneBased && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Milestones</h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-[50%] border-t border-gray-300"></div>
            </div>
            <div className="relative">
              {sortedMilestones.map((milestone, index) => (
                <div key={index} className="flex items-center mb-4 relative">
                  <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center -left-2">
                    {index + 1}
                  </div>
                  <div className="ml-8 bg-white p-4 border border-gray-200 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
                    <p className="text-gray-600">Deadline: {milestone.deadline}</p>
                    <p className="text-gray-600">Amount: ${milestone.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-left space-x-4">
       
            <button
              onClick={handleUpdate}
              className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
            >
              <FaEdit className="inline mr-2" /> Edit Contract
            </button>
            <button
              onClick={handleTerminate}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
            >
              <FaTrash className="inline mr-2" /> Terminate Contract
            </button>
            <button
              onClick={handleDispute}
              className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition"
            >
              <FaExclamationTriangle className="inline mr-2" /> Dispute Contract
            </button>
      </div>
    </div>
  );
};

export default ContractDetailsPage;
