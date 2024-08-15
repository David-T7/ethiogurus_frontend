import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaTrash } from 'react-icons/fa';

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

const EditContractPage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Simulate fetching contract details
    setContract(mockContractData);
  }, [contractId]);

  const handleUpdate = () => {
    console.log('Updated Contract:', contract);
    // Simulate updating contract
    navigate(`/contracts/${contractId}`); // Redirect to contract details page
  };

  const handleDeleteMilestone = (index) => {
    const updatedMilestones = contract.milestones.filter((_, i) => i !== index);
    setContract({ ...contract, milestones: updatedMilestones });
  };

  if (!contract) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-6 text-brand-dark-blue">Edit Contract</h1>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Project Fee</h2>
        <input
          type="number"
          value={contract.projectFee}
          onChange={(e) => setContract({ ...contract, projectFee: e.target.value })}
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Terms</h2>
        <textarea
          value={contract.contractTerms}
          onChange={(e) => setContract({ ...contract, contractTerms: e.target.value })}
          className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
          rows="4"
        />
      </div>

      {contract.isMilestoneBased && (
        <div className="mb-6">
          <h2 className="text-xl font-normal text-gray-800 mb-4">Milestones</h2>
          {contract.milestones.map((milestone, index) => (
            <div key={index} className="flex flex-col mb-4 border border-gray-200 p-4 rounded-lg relative">
              <div className="flex flex-col mb-2">
                <label className="text-gray-800">Title</label>
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) => {
                    const updatedMilestones = [...contract.milestones];
                    updatedMilestones[index] = { ...updatedMilestones[index], title: e.target.value };
                    setContract({ ...contract, milestones: updatedMilestones });
                  }}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col mb-2">
                <label className="text-gray-800">Deadline</label>
                <input
                  type="date"
                  value={milestone.deadline}
                  onChange={(e) => {
                    const updatedMilestones = [...contract.milestones];
                    updatedMilestones[index] = { ...updatedMilestones[index], deadline: e.target.value };
                    setContract({ ...contract, milestones: updatedMilestones });
                  }}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col mb-2">
                <label className="text-gray-800">Amount</label>
                <input
                  type="number"
                  value={milestone.amount}
                  onChange={(e) => {
                    const updatedMilestones = [...contract.milestones];
                    updatedMilestones[index] = { ...updatedMilestones[index], amount: e.target.value };
                    setContract({ ...contract, milestones: updatedMilestones });
                  }}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => handleDeleteMilestone(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          <FaSave className="inline mr-2" /> Save Changes
        </button>
        <button
          onClick={() => navigate(`/contracts/${contractId}`)}
          className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
        >
          <FaTimes className="inline mr-2" /> Cancel
        </button>
      </div>
    </div>
  );
};

export default EditContractPage;
