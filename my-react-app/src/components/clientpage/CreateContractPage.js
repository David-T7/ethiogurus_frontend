import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClientLayout from './ClientLayoutPage';
import { FaPlus, FaTrash } from 'react-icons/fa';

const CreateContractPage = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const [isMilestoneBased, setIsMilestoneBased] = useState(false);
  const [projectFee, setProjectFee] = useState('');
  const [milestones, setMilestones] = useState([{ title: '', amount: '', deadline: '' }]);
  const [contractTerms, setContractTerms] = useState('');

  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [name]: value };
    setMilestones(updatedMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', amount: '', deadline: '' }]);
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle contract creation (e.g., API call)
    console.log('Contract created with details:', { projectId, projectFee, isMilestoneBased, milestones, contractTerms });
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto p-8 mt-8">
        <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
          Create Contract for Project #{projectId}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-normal text-gray-800 mb-4">Project Fee</h2>
            <input
              type="number"
              value={projectFee}
              onChange={(e) => setProjectFee(e.target.value)}
              placeholder="Enter project fee"
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="p-6 mb-3">
            <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Type</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isMilestoneBased}
                onChange={() => setIsMilestoneBased(!isMilestoneBased)}
                id="milestone-checkbox"
                className="mr-2"
              />
              <label htmlFor="milestone-checkbox" className="text-gray-800">Milestone Based Contract</label>
            </div>
          </div>

          {isMilestoneBased && (
            <div className="p-6 mb-6">
              <h2 className="text-xl font-normal text-gray-800 mb-4">Milestones</h2>
              {milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col mb-4 border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={`title-${index}`} className="text-gray-800">Title</label>
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, e)}
                    placeholder="Milestone title"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                  <div className="flex flex-col mt-4">
                    <label htmlFor={`deadline-${index}`} className="text-gray-800 mb-2">Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      value={milestone.deadline}
                      onChange={(e) => handleMilestoneChange(index, e)}
                      id={`deadline-${index}`}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col mt-4">
                    <label htmlFor={`amount-${index}`} className="text-gray-800 mb-2">Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={milestone.amount}
                      onChange={(e) => handleMilestoneChange(index, e)}
                      placeholder="Amount"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-2 text-lg" /> Add Milestone
              </button>
            </div>
          )}

          <div className="p-6 mb-3">
            <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Terms</h2>
            <textarea
              value={contractTerms}
              onChange={(e) => setContractTerms(e.target.value)}
              placeholder="Enter contract terms and conditions"
              className="w-full border border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500"
              rows="4"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
            >
              Create Contract
            </button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
};

export default CreateContractPage;
