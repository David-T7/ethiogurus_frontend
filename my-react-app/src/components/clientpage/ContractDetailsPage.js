import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';

const ContractDetailsPage = () => {
  const { id: contractId } = useParams();
  const [contract, setContract] = useState(null);
  const [milestones, setMilestones] = useState([]); // State to store milestones
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counterOffers, setCounterOffers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractDetails = async () => {
      try {
        const token = localStorage.getItem('access');

        // Fetch the contract details
        const contractResponse = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContract(contractResponse.data);

        // Fetch milestones for the contract
        const milestonesResponse = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/milestones/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMilestones(milestonesResponse.data); // Store fetched milestones

      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchContractDetails();
  }, [contractId]);

  const handleUpdate = () => {
    navigate(`/contracts/${contractId}/edit`);
  };

  const handleCounterOffer = () => {
    navigate(`/contract-counter-offer/${contractId}`);
  };
  const handleCheckCounterOffers = () => {
    navigate(`/contract-counter-offers/${contractId}`,
      {
        state:{
          counterOffers:counterOffers
        }
      }
    );
  };

  useEffect(() => {
    const fetchCounterOffers = async () => {
      try {
        const token = localStorage.getItem("access"); // Get access token
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contracts/${contractId}/counter-offers/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCounterOffers(response.data); // Set counter offers related to the contract
      } catch (error) {
        console.error("Failed to fetch counter offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounterOffers();
  }, [contract]);

  const handleSendContract = async () => {
    try {
      const token = localStorage.getItem('access');
      // Update the contract status to pending
      await axios.patch(`http://127.0.0.1:8000/api/contracts/${contractId}/`, { status: 'pending' }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch the updated contract details
      const updatedContractResponse = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContract(updatedContractResponse.data);

      alert('Contract sent and status updated to pending successfully!'); // Provide feedback to the user

    } catch (err) {
      alert('Failed to send contract or update status. Please try again.'); // Handle error appropriately
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!contract) return <div>No contract found.</div>;

  // Safely access projectFee
  const projectFee = contract.amount_agreed;

  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-6 text-brand-dark-blue">Contract Details</h1>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Project Fee</h2>
        <p className="text-gray-600">{projectFee} Birr</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-normal text-gray-800 mb-4">Contract Terms</h2>
        <p className="text-gray-600">{contract.terms}</p>
      </div>

      {contract.milestone_based && milestones.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-normal text-gray-800 mb-4">Milestones</h2>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-[50%] border-t border-gray-300"></div>
            </div>
            <div className="relative">
              {sortedMilestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-center mb-4 relative">
                  <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center -left-2">
                    {index + 1}
                  </div>
                  <div className="ml-8 bg-white p-4 border border-gray-200 rounded-lg shadow-md">
                    <h3 className="text-xl font-normal text-gray-800">{milestone.title}</h3>
                    <p className="text-gray-600">Due Date: {new Date(milestone.due_date).toLocaleDateString()}</p>
                    <p className="text-gray-600">Amount: {milestone.amount} Birr</p>
                    <p className="text-gray-600">Status: {milestone.status}</p>
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
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          <FaEdit className="inline mr-2" /> Edit Contract
        </button>

        {contract.status === 'draft' && ( // Conditionally render the send button
          <button
            onClick={handleSendContract}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Send Contract
          </button>
        )}

{counterOffers.length > 0 && (
            <button
              onClick={handleCheckCounterOffers}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
            >
              Check Counter Offers
            </button>
          ) }

      </div>
    </div>
  );
};

export default ContractDetailsPage;
