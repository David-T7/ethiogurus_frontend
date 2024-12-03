import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
const fetchDisputeDetails = async (disputeId, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const ContractDisputeDetails = () => {
  const { id: disputeId } = useParams();
  const location = useLocation();
  const { contract, clientId } = location.state || {};
  const navigate = useNavigate();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

  const { data: dispute, isLoading, error } = useQuery({
    queryKey: ['disputeDetails', disputeId],
    queryFn: () => fetchDisputeDetails(disputeId, token),
    enabled: !!disputeId && !!token,
  });

  if (isLoading) {
    return <p className="text-gray-600">Loading dispute details...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error fetching dispute details.</p>;
  }

  const handleRespondToDispute = (disputeId) => {
    navigate(`/send-response/${disputeId}`);
  };

  const handleUpdateDispute = (disputeId) => {
    navigate(`/update-dispute/${disputeId}`);
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">
        Dispute for {contract?.title || 'Contract'}
      </h1>

      {/* Display Dispute Details */}
      <div className="dispute-card bg-white p-4 border border-gray-200 rounded-lg mb-6 shadow-sm relative">
        <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center right-12 top-4">
          <span
            className={`text-xs font-semibold rounded-full px-4 py-1 ${getDisputeResponseStatus(
              dispute.got_response
            )}`}
            style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
          >
            {dispute.got_response ? 'got response' : 'no response'}
          </span>
        </div>
        <p className="font-medium text-gray-700 mb-2">{dispute.title}</p>
        <p className="text-gray-600 mb-4">{dispute.description}</p>
      </div>

      {/* Refund Offer Information */}
      <div className="mb-6 p-4 border rounded-lg border-gray-300 bg-gray-50">
        <h4 className="font-medium text-gray-700 mb-2">Refund Offer Details</h4>
        <p className="text-gray-800">
          {dispute.return_type === 'full' ? 'Full Refund Offer' : 'Partial Refund Offer'}
        </p>
        <p className="text-gray-800">Amount: ${dispute.return_amount}</p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        {dispute.created_by === clientId ? (
          !dispute.got_response && (
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
              onClick={() => handleUpdateDispute(dispute.id)}
            >
              Edit Dispute
            </button>
          )
        ) : (
          !dispute.got_response && (
            <button
              onClick={() => handleRespondToDispute(dispute.id)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              Respond
            </button>
          )
        )}
      </div>
    </div>
  );
};

// Helper function to get dispute status styling
const getDisputeResponseStatus = (got_response) => {
  switch (got_response) {
    case true:
      return 'bg-yellow-500 text-black';
    case false:
      return 'bg-red-500 text-black';
    default:
      return 'bg-gray-300 text-black';
  }
};

export default ContractDisputeDetails;
