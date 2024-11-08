import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DisputeHistoryPage = () => {
  const { id: disputeId } = useParams(); // Fetch the specific dispute ID from URL params
  const [dispute, setDispute] = useState(null);
  const [disputeResponses, setDisputeResponses] = useState([]);
  const token = localStorage.getItem("access");
  const location = useLocation();
  const navigate = useNavigate();
  const { drcForwardedItem } = location.state || {}; // If there’s related data passed, e.g., freelancerId

  useEffect(() => {
    const fetchDisputeDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        response.data.creator = await getUserType(response?.data.created_by)
        setDispute(response.data);
      } catch (error) {
        console.error('Error fetching dispute details:', error);
      }
    };
    fetchDisputeDetails();
  }, [disputeId, token]);

  useEffect(() => {
    const fetchDisputeResponses = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/contracts/${dispute.contract}/dispute-responses/`, 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("dispute response ", response.data);
  
        // Map over response data to fetch creator for each item
        const updatedResponses = await Promise.all(
          response.data.map(async (item) => {
            const creator = await getUserType(item.created_by);
            return { ...item, creator };
          })
        );
  
        setDisputeResponses(updatedResponses);
      } catch (error) {
        console.error('Error fetching dispute responses:', error);
      }
    };
  
    fetchDisputeResponses();
  }, [dispute, token]);
  

  const handleDisputeResponseDetails = (disputeResponseId) => {
    navigate(`/drc-dispute-response/${disputeResponseId}`, {
      state: {
        drcForwardedItem: drcForwardedItem,
      },
    });
  };

  const getUserType = async (id) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/user-type/`,
        { user_id: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("user type response is ", response.data);
      return response.data.user_type;
    } catch (error) {
      console.error(`Error fetching user type for user id ${id}:`, error);
    }
  };

  const handleDisputeDetails = (disputeId) => {
    navigate(`/drc-dispute/${disputeId}`, {
      state: {
        drcForwardedItem: drcForwardedItem,
      },
    });
  };

  if (!dispute) {
    return <div className="text-center py-8 text-gray-500">Loading dispute details...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Dispute History: {dispute.title}</h1>
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-2">
          
          <h2 className="text-lg font-medium text-gray-700">{dispute.title}</h2>
          <span className={`text-xs font-semibold rounded-full px-4 py-1 ${getDRCForwardedStatusStyle(drcForwardedItem.solved)}`}>
            {drcForwardedItem.solved ? "solved":"not solved"}
          </span>
        </div>
        <p className="text-gray-600">Created By: {dispute?.creator}</p>

        <p className="text-gray-600 mb-4">{dispute.description}</p>
        <p className="text-gray-500 text-sm">Filed on: {new Date(dispute.created_at).toLocaleDateString()}</p>
        <button 
            onClick={() => handleDisputeDetails(dispute.id)}
            className="text-blue-600 underline hover:text-blue-800 transition duration-200">
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
              <p className="font-semibold text-gray-700">Response By {response?.creator}</p>
              <p className="font-semibold text-gray-700">{response.title}</p>
              <p className="text-gray-600 mb-2">{response.comments}</p>
              <button
                onClick={() => handleDisputeResponseDetails(response.id)}
                className="text-blue-600 underline hover:text-blue-800 transition duration-200">
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

// Helper function to get drc frowarded dispute status styling
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
