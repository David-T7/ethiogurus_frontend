import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchDisputeDetails = async (disputeId, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const creator = await fetchUserType(response.data.created_by, token);
  return { ...response.data, creator };
};

const fetchDisputeResponses = async (contractId, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/dispute-responses/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const responsesWithCreator = await Promise.all(
    response.data.map(async (item) => {
      const creator = await fetchUserType(item.created_by, token);
      return { ...item, creator };
    })
  );

  return responsesWithCreator;
};

const fetchUserType = async (userId, token) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/user/user-type/`,
      { user_id: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.user_type;
  } catch (error) {
    console.error(`Error fetching user type for user ID ${userId}:`, error);
    return 'Unknown';
  }
};

const DisputeHistoryPage = () => {
  const { id: disputeId } = useParams();
  const token = localStorage.getItem('access');
  const location = useLocation();
  const navigate = useNavigate();
  const { drcForwardedItem } = location.state || {};

  // Fetch dispute details
  const { data: dispute, isLoading: isLoadingDispute } = useQuery({
    queryKey: ['disputeDetails', disputeId],
    queryFn: () => fetchDisputeDetails(disputeId, token),
  });

  // Fetch dispute responses
  const { data: disputeResponses = [], isLoading: isLoadingResponses } = useQuery({
    queryKey: ['disputeResponses', dispute?.contract],
    queryFn: () => fetchDisputeResponses(dispute.contract, token),
    enabled: !!dispute?.contract, // Wait until `dispute.contract` is available
  });

  const handleDisputeResponseDetails = (disputeResponseId) => {
    navigate(`/drc-dispute-response/${disputeResponseId}`, {
      state: { drcForwardedItem },
    });
  };

  const handleDisputeDetails = (disputeId) => {
    navigate(`/drc-dispute/${disputeId}`, {
      state: { drcForwardedItem },
    });
  };

  if (isLoadingDispute || isLoadingResponses) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Dispute History: {dispute.title}</h1>
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium text-gray-700">{dispute.title}</h2>
          <span
            className={`text-xs font-semibold rounded-full px-4 py-1 ${getDRCForwardedStatusStyle(
              drcForwardedItem?.solved
            )}`}
          >
            {drcForwardedItem.solved ? 'Solved' : 'Not Solved'}
          </span>
        </div>
        <p className="text-gray-600">Created By: {dispute.creator}</p>
        <p className="text-gray-600 mb-4">{dispute.description}</p>
        <p className="text-gray-500 text-sm">Filed on: {new Date(dispute.created_at).toLocaleDateString()}</p>
        <button
          onClick={() => handleDisputeDetails(dispute.id)}
          className="text-blue-600 underline hover:text-blue-800 transition duration-200"
        >
          Check Dispute
        </button>
      </div>

      <h3 className="text-xl font-normal text-brand-dark-blue mb-4">Responses</h3>
      <div className="timeline ml-4 border-l-2 border-blue-500 pl-4">
        {disputeResponses.length > 0 ? (
          disputeResponses.map((response, idx) => (
            <div
              key={response.id}
              className="response-card bg-blue-50 p-3 border rounded-lg mb-4 shadow-sm relative"
            >
              <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center -left-2 top-4">
                {idx + 1}
              </div>
              <p className="font-semibold text-gray-700">Response By {response.creator}</p>
              <p className="font-semibold text-gray-700">{response.title}</p>
              <p className="text-gray-600 mb-2">{response.comments}</p>
              <button
                onClick={() => handleDisputeResponseDetails(response.id)}
                className="text-blue-600 underline hover:text-blue-800 transition duration-200"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No responses yet.</p>
        )}
      </div>
    </div>
  );
};

const getDRCForwardedStatusStyle = (status) => {
  switch (status) {
    case true:
      return 'bg-green-500 text-white';
    case false:
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
};

export default DisputeHistoryPage;
