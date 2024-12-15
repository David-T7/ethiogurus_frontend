import React, { useState, useEffect } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
const DisputeResponseDetailsPage = () => {
  const { id: responseId } = useParams();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);
  const {freelancerId} = location.state || null    // Error state
  const [responseDetails, setResponseDetails] = useState({
    title: '',
    comments: '',
    decision: '',
    documents: [],
    return_type: '',
    return_amount: '',
    created_at: '',
  });

  useEffect(() => {
    const fetchResponseDetails = async () => {
      try {

       
        const response = await axios.get(`http://127.0.0.1:8000/api/dispute-response/${responseId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResponseDetails(response.data);
      } catch (error) {
        console.error('Error fetching dispute response details:', error);
        setError("Failed to load response details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchResponseDetails();
  }, [responseId, token]);

  const handleEditDisputeResponse = (disputeResponseId) => {
    navigate(`/dispute-response/${disputeResponseId}/edit` , {
        state:{
            freelancerId:freelancerId
        }
    });
  };
  const handleCounterResponse = (disputeResponseId) => {
    navigate(`/counter-response/${disputeResponseId}` , {
        state:{
            freelancerId:freelancerId
        }
    });
  };

  
  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;



  return (
    <div className="max-w-md mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Dispute Response Details</h1>
      
      {/* Display Response Details */}
      <div
            className="dispute-card bg-white p-4 border border-gray-200 rounded-lg mb-6 shadow-sm relative"
          >      <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center right-14 top-4">
  <span 
    className={`text-xs font-semibold rounded-full px-4 py-1 ${getDisputeResponseStatus(responseDetails.got_response)}`}
    style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} // Add these styles
  >
    {responseDetails.got_response ? "got response" : "got no response"}
  </span>
  </div>
        <h3 className="font-medium text-gray-700 mb-2">Title:</h3>
        <p className="text-gray-800 mb-4">{responseDetails.title}</p>
        
        <h3 className="font-medium text-gray-700 mb-2">Comments:</h3>
        <p className="text-gray-800 mb-4">{responseDetails.description}</p>
        
      {/* Refund Offer Information */}
      <div className="mb-6">
      <h3 className="font-medium text-gray-700 mb-2">Refund Offer Details</h3>
        <p className="text-gray-800">
          {responseDetails.return_type === 'full' ? 'Full Refund Offer' : 'Partial Refund Offer'}
          <p className="text-gray-800">Amount: {responseDetails.return_amount} Birr</p>

        </p>
      </div>
        
        <h3 className="font-medium text-gray-700 mb-2">Submitted On:</h3>
        <p className="text-gray-800 mb-4">{new Date(responseDetails.created_at).toLocaleDateString()}</p>
      </div>

      {/* Supporting Documents */}
      {responseDetails.supporting_documents?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Supporting Documents:</h3>
          <ul className="list-disc list-inside">
            {responseDetails.supporting_documents.map((doc, index) => (
              <li key={index} className="text-blue-600 hover:underline">
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                  {doc.file_name || `Document ${index + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}


       {/* Submit Button */}
       <div className="flex justify-center">
       {responseDetails.created_by === freelancerId ? !responseDetails.got_response &&
       <button
          onClick={() => handleEditDisputeResponse(responseDetails.id)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Edit Response
        </button>
        :
        !responseDetails.got_response &&
       <button
          className="bg-blue-500 w-[50%] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"        
          onClick={() => handleCounterResponse(responseDetails.id)}
        >
          Respond
        </button>
}

      </div>
    </div>
  );
};

const getDisputeResponseStatus = (got_response) => {
    switch (got_response) {
      case true:
        return 'bg-yellow-500 text-black';
      case false:
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  };



export default DisputeResponseDetailsPage;
