import React, { useEffect, useState } from 'react';
import { useParams, useLocation , useNavigate } from 'react-router-dom';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
const DisputesPage = () => {
  const { id: contractId } = useParams();
  const [disputes, setDisputes] = useState([]);
  const [disputeResponses, setDisputeResponses] = useState([]);
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const location = useLocation();
  const navigate = useNavigate()
  const { contract , freelancerId } = location.state || {};

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/disputes/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisputes(response.data);
      } catch (error) {
        console.error('Error fetching disputes:', error);
      }
    };

    const fetchDisputeResponses = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/dispute-responses/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDisputeResponses(response.data);
      } catch (error) {
        console.error('Error fetching dispute responses:', error);
      }
    };

    fetchDisputes();
    fetchDisputeResponses();
  }, [contractId, token]);


  const handleDisputeDetails = (disputeId) => {
    navigate(`/dispute-details/${disputeId}`, {
      state: {
        contract: contract,
        freelancerId:freelancerId
      },
    });
  };

  const handleDisputeResponseDetails = (disputeResponseId) => {
    navigate(`/disputeresponse/${disputeResponseId}`, {
      state: {
        freelancerId:freelancerId
      },
    });
  };



  return (
    <div className="max-w-lg mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Disputes for Contract: {contract?.title}</h1>

      {/* Dispute Cards */}
      {disputes.length === 0 ? (
        <p className="text-gray-600">No disputes found.</p>
      ) : (
        disputes.map((dispute, index) => (
          <div
            key={dispute.id}
            className="dispute-card bg-white p-4 border border-gray-200 rounded-lg mb-6 shadow-sm relative"
          >
        <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center right-14 top-4">

            <span className={`text-xs font-semibold rounded-full px-4 py-1  ${getDisputeStatusStyle(dispute.status)}`}>
              {dispute.status}
            </span>
            </div>
            <p className="font-medium text-gray-700 mb-2">{dispute.title}</p>
            <p className="text-gray-600 mb-4">{dispute.description}</p>
            <button 
            onClick={() => handleDisputeDetails(dispute.id)}
            className="text-blue-600 underline hover:text-blue-800 transition duration-200">
                      Check Dispute
            </button>
            {/* Display Responses for Each Dispute */}
            <h4 className="font-medium text-gray-700 mb-2">Response History:</h4>
            <div className="response-timeline ml-8 border-l-2 border-blue-500 pl-4">
              {disputeResponses
                .filter((response) => response.dispute === dispute.id) // Filter responses by dispute ID
                .map((response, idx) => (
                  <div
                    key={response.id}
                    className="response-card bg-blue-50 p-3 border rounded-lg mb-3 shadow-sm relative"
                  >
                    <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center -left-2 top-4 ">
                      {idx + 1}
                    </div>
                    <p className="font-semibold text-gray-700">{response.title}</p>
                    <p className="text-gray-600 mb-2">{response.comments}</p>
                    <button 
                    onClick={()=>handleDisputeResponseDetails(response.id)}
                    className="text-blue-600 underline hover:text-blue-800 transition duration-200">
                      
                      View Details
                    </button>
                  </div>
                ))}

              {/* No responses for the dispute */}
              {disputeResponses.filter((response) => response.dispute === dispute.id).length === 0 && (
                <p className="text-gray-500 italic">No responses yet.</p>
              )}
            </div>
          </div>
        ))
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

export default DisputesPage;
