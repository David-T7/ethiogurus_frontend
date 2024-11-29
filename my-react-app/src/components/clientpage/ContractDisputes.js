import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchDisputes = async (contractId, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/disputes/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchDisputeResponses = async (contractId, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/dispute-responses/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const ContractDisputes = () => {
  const { id: contractId } = useParams();
  const location = useLocation();
  const { contract, clientId, milestones } = location.state || {};
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const { data: disputes, isLoading: loadingDisputes, error: disputeError } = useQuery({
    queryKey: ['disputes', contractId],
    queryFn: () => fetchDisputes(contractId, token),
    enabled: !!contractId && !!token,
  });

  const { data: disputeResponses, isLoading: loadingResponses, error: responseError } = useQuery({
    queryKey: ['disputeResponses', contractId],
    queryFn: () => fetchDisputeResponses(contractId, token),
    enabled: !!contractId && !!token,
  });

  const handleDisputeDetails = (disputeId) => {
    navigate(`/contract-dispute/${disputeId}/check`, {
      state: {
        contract: contract,
        clientId: clientId,
      },
    });
  };

  const handleDisputeResponseDetails = (disputeResponseId) => {
    navigate(`/contract-disputeresponse/${disputeResponseId}`, {
      state: {
        contractId: contractId,
        clientId: clientId,
      },
    });
  };

  if (loadingDisputes || loadingResponses) {
    return <p className="text-gray-600">Loading disputes...</p>;
  }

  if (disputeError || responseError) {
    return <p className="text-red-600">Error fetching disputes or responses.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Disputes for Contract: {contract?.title}</h1>

      {disputes.length === 0 ? (
        <p className="text-gray-600">No disputes found.</p>
      ) : (
        disputes.map((dispute) => {
          const matchedMilestone = milestones?.find((milestone) => milestone.id === dispute.milestone);

          return (
            <div
              key={dispute.id}
              className="dispute-card bg-white p-4 border border-gray-200 rounded-lg mb-6 shadow-sm relative"
            >
              <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center right-14 top-4">
                <span className={`text-xs font-semibold rounded-full px-4 py-1 ${getDisputeStatusStyle(dispute.status)}`}>
                  {dispute.status}
                </span>
              </div>

              {matchedMilestone && (
                <h2 className="text-xl font-normal text-brand-dark-blue mt-2">{matchedMilestone.title}</h2>
              )}

              <p className="font-medium text-gray-700 mb-2">{dispute.title}</p>
              <p className="text-gray-600 mb-4">{dispute.description}</p>
              <button
                onClick={() => handleDisputeDetails(dispute.id)}
                className="text-blue-600 underline hover:text-blue-800 transition duration-200"
              >
                Check Dispute
              </button>

              <h4 className="font-medium text-gray-700 mb-2">Response History:</h4>
              <div className="response-timeline ml-8 border-l-2 border-blue-500 pl-4">
                {disputeResponses
                  .filter((response) => response.dispute === dispute.id)
                  .map((response, idx) => (
                    <div
                      key={response.id}
                      className="response-card bg-blue-50 p-3 border rounded-lg mb-3 shadow-sm relative"
                    >
                      <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center -left-2 top-4">
                        {idx + 1}
                      </div>
                      <p className="font-semibold text-gray-700">{response.title}</p>
                      <p className="text-gray-600 mb-2">{response.comments}</p>
                      <button
                        onClick={() => handleDisputeResponseDetails(response.id)}
                        className="text-blue-600 underline hover:text-blue-800 transition duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  ))}

                {disputeResponses.filter((response) => response.dispute === dispute.id).length === 0 && (
                  <p className="text-gray-500 italic">No responses yet.</p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

// Helper function to get dispute status styling
const getDisputeStatusStyle = (status) => {
  switch (status) {
    case 'resolved':
      return 'bg-green-500 text-white';
    case 'auto_resolved':
      return 'bg-yellow-500 text-black';
    case 'open':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-300 text-black';
  }
};

export default ContractDisputes;
