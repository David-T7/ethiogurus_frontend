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
    status: 'Accepted',
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

const CounterOfferPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [offer, setOffer] = useState({
    newFee: '',
    newDeadline: '',
    comments: '',
    milestones: [],
  });
  const [rejectMilestoneOption, setRejectMilestoneOption] = useState(false);

  useEffect(() => {
    // Replace with API call to fetch contract details by ID
    const contractData = mockContractsData[id];
    setContract(contractData);

    if (contractData.milestones.length) {
      setOffer((prevOffer) => ({
        ...prevOffer,
        milestones: contractData.milestones.map(milestone => ({
          id: milestone.id,
          newAmount: '',
          newDueDate: '',
        })),
      }));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOffer((prevOffer) => ({
      ...prevOffer,
      [name]: value,
    }));
  };

  const handleMilestoneChange = (index, e) => {
    const { name, value } = e.target;
    const newMilestones = [...offer.milestones];
    newMilestones[index] = {
      ...newMilestones[index],
      [name]: value,
    };
    setOffer((prevOffer) => ({
      ...prevOffer,
      milestones: newMilestones,
    }));
  };

  const handleCheckboxChange = () => {
    setRejectMilestoneOption(!rejectMilestoneOption);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with API call to submit the counter offer
    console.log(`Submitting counter offer for contract ID ${id}:`, offer, rejectMilestoneOption);
    // Redirect or show a confirmation message
    navigate(`/contract/${id}`);
  };

  if (!contract) {
    return <div className="text-center py-8">Loading contract details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Submit Counter Offer</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="newFee" className="block text-lg font-normal text-brand-blue mb-2">
            Proposed Fee
          </label>
          <input
            type="text"
            id="newFee"
            name="newFee"
            value={offer.newFee}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newDeadline" className="block text-lg font-normal text-brand-blue mb-2">
            Proposed Deadline
          </label>
          <input
            type="date"
            id="newDeadline"
            name="newDeadline"
            value={offer.newDeadline}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        {contract.milestones.length > 0 && (
          <>
            <div className="mb-6">
              <input
                type="checkbox"
                id="rejectMilestones"
                checked={rejectMilestoneOption}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="rejectMilestones" className="text-lg font-normal text-brand-blue">
                Reject Milestone-Based Option
              </label>
            </div>
            {!rejectMilestoneOption && (
              <div className="mb-6">
                <h3 className="text-lg font-normal text-brand-blue mb-2">Milestones</h3>
                {offer.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="mb-4 border-t border-gray-300 pt-4">
                    <label htmlFor={`milestoneAmount-${milestone.id}`} className="block text-md font-normal text-brand-blue mb-2">
                      Proposed Fee for {contract.milestones.find(m => m.id === milestone.id).title}
                    </label>
                    <input
                      type="text"
                      id={`milestoneAmount-${milestone.id}`}
                      name="newAmount"
                      value={milestone.newAmount}
                      onChange={(e) => handleMilestoneChange(index, e)}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <label htmlFor={`milestoneDueDate-${milestone.id}`} className="block text-md font-normal text-brand-blue mt-2 mb-2">
                      Proposed Due Date
                    </label>
                    <input
                      type="date"
                      id={`milestoneDueDate-${milestone.id}`}
                      name="newDueDate"
                      value={milestone.newDueDate}
                      onChange={(e) => handleMilestoneChange(index, e)}
                      className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        <div className="mb-6">
          <label htmlFor="comments" className="block text-lg font-normal text-brand-blue mb-2">
            Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            value={offer.comments}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
            rows="4"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit Counter Offer
        </button>
      </form>
    </div>
  );
};

export default CounterOfferPage;
