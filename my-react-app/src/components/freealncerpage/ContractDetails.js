import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const fetchContractDetails = async ({ queryKey }) => {
  const [, { id, token }] = queryKey;
  const response = await axios.get(`${API_BASE_URL}/freelancer-contracts/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchMilestones = async ({ queryKey }) => {
  const [, { contractId, token }] = queryKey;
  const response = await axios.get(`${API_BASE_URL}/contracts/${contractId}/milestones/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchDisputes = async ({ queryKey }) => {
  const [, { contractId, token }] = queryKey;
  const response = await axios.get(`${API_BASE_URL}/contracts/${contractId}/disputes/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchCounterOffers = async ({ queryKey }) => {
  const [, { contractId, token }] = queryKey;
  const response = await axios.get(`${API_BASE_URL}/contracts/${contractId}/counter-offers/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchFreelancerDetails = async ({ queryKey }) => {
  const [, { token }] = queryKey;
  const response = await axios.get(`${API_BASE_URL}/user/freelancer/manage/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [error, setError] = useState("");

  const { data: contract, isLoading: contractLoading } = useQuery({
    queryKey: ["contractDetails", { id, token }],
    queryFn: fetchContractDetails,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  const { data: milestones = [], isLoading: milestonesLoading } = useQuery({
    queryKey: ["contractMilestones", { contractId: contract?.id, token }],
    queryFn: fetchMilestones,
    enabled: !!contract?.milestone_based,
    staleTime: 1000 * 60 * 5,
  });

  const { data: disputes = [] } = useQuery({
    queryKey: ["contractDisputes", { contractId: contract?.id, token }],
    queryFn: fetchDisputes,
    enabled: !!contract?.id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: counterOffers = [] } = useQuery({
    queryKey: ["counterOffers", { contractId: contract?.contract_update || id, token }],
    queryFn: fetchCounterOffers,
    enabled: !!contract,
    staleTime: 1000 * 60 * 5,
  });

  const { data: freelancer } = useQuery({
    queryKey: ["freelancerDetails", { token }],
    queryFn: fetchFreelancerDetails,
    staleTime: 1000 * 60 * 5,
  });

  const handleAcceptContract = async () => {
    try {
      await axios.patch(
        `${API_BASE_URL}/freelancer-contracts-update/${id}/`,
        { status: "accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/mycontracts`);
    } catch (err) {
      setError(err.response ? err.response.data.detail : "Failed to accept the contract");
    }
  };

  const handleAcceptMilestone = async (milestoneId) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/freelancer-milestones-update/${milestoneId}/`,
        { status: "accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setError(err.response ? err.response.data.detail : "Failed to accept the milestone");
    }
  };


  const handleCounterOffer = () => {
    navigate(`/submit-counter-offer/${id}`);
  };
  const handleCheckCounterOffers = () => {
    navigate(`/counter-offers/${id}`,
      {
        state:{
          counterOffers:counterOffers,
          contract:contract
        }
      }
    );
  };

  const handleCreateDispute = (milestoneId) => {
    navigate(`/contractDispute/${contract.id}/createdispute`, {
      state: {
        milestoneId: milestoneId,
      },
    });
  };

  const handleRespondToDispute = (disputeId) => {
    navigate(`/dispute-response/${disputeId}`);
  };

  const handleDisputes = () => {
    navigate(`/disputes/${contract.id}` ,{
      state: {
        contract: contract,
        freelancerId: freelancer?.id
      },
    }
    );
  };

  const navigateToUpdateDisputeResponse  = async (disputeId) => {
    navigate(`/dispute-response/${disputeId}`);
  };

  const sortedMilestones = React.useMemo(() => 
    [...milestones].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)),
    [milestones]
  );

  if (contractLoading || milestonesLoading) return <div className="text-center">Loading contract details...</div>;
  if (error) return <div className="text-red-600 text-center">Error: {error}</div>;
  if (!contract) return <div className="text-center">No contract found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <div className="flex items-center mb-4">
        <h1 className="text-4xl font-thin text-brand-dark-blue">
          {contract.title}
        </h1>
      </div>
      {!contract.hourly &&<p className="mb-2">
        Deadline: {new Date(contract.end_date).toLocaleDateString()}
      </p>}
      <h1 className="text-2xl font-thin text-brand-dark-blue mb-4">
      {contract.hourly ? "Hourly Fee":"Project Fee"}
      </h1>
      <p className="mb-2">{contract.amount_agreed} Birr</p>
      <h1 className="text-2xl font-thin text-brand-dark-blue mb-4">
        Contract Type
      </h1>
      <p className="text-gray-700 mb-4">{contract.hourly ? "Hourly":"One Time Fee"}</p>

      {contract.hourly && <><h1 className="text-2xl font-thin text-brand-dark-blue mb-4">
        Project Duration
      </h1>
      <p className="text-gray-700 mb-4">{contract.duration}</p>
      </>}
      <h3 className="text-2xl font-thin text-brand-dark-blue mb-2">
        Milestones
      </h3>
      <div className="border-t border-gray-200 pt-4">
      {contract.milestone_based && milestones.length > 0 ? (
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
                    {contract.status !== "pending"  && milestone.status === "pending" &&
                    <button
            onClick={() => handleAcceptMilestone(milestone.id)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Accept
          </button>
                  }
                    {( (milestone.status === "active" &&
                !disputes.some(
                  (dispute) => dispute.milestone === milestone.id && dispute.status ==="open"
                )) && (
                  <button
                    onClick={() => handleCreateDispute(milestone.id)}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                  >
                    Create Dispute
                  </button>
                ))} 

           </div> 
         
           </div>
              ))}
            </div>
          </div>
        </div>
      )      
           : (
          <p className="text-gray-600 mb-2">
            No milestones found for this contract.
          </p>
        )}
      </div>
      {contract.status === "pending" && (
        <div className="flex space-x-4">
          <button
            onClick={handleAcceptContract}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Accept
          </button>
          {counterOffers.length > 0 ? (
            <button
              onClick={handleCheckCounterOffers}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Counter Offers
            </button>
          ) : (
            <button
              onClick={handleCounterOffer}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Make Counter Offer
            </button>
          )}

{counterOffers.length > 0 && contract.status == "pending"  && (
            <button
              onClick={handleCounterOffer}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Make Counter Offer
            </button>
          )}
        </div>

        
      )}
       {disputes.length > 0 && <div className="mb-6">
        <h3 className="text-3xl font-thin text-brand-dark-blue mb-2">Disputes</h3>
        <button
        onClick={handleDisputes}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
      >
        Check Disputes
      </button>
       </div>
}
    </div>
  );
};

// Helper function to get contract status styling
const getContractStatusStyle = (status) => {
  switch (status) {
    case "Completed":
      return "text-green-600";
    case "Active":
      return "text-blue-600";
    case "In Dispute":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};
export default ContractDetails;
