import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const DisputeManagerDashboard = () => {
  const [drcForwarded, setDrcForwareded] = useState([]);
  const [disputeDetails, setDisputeDetails] = useState({});
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");
  const navigate = useNavigate()
  useEffect(() => {
    const fetchDRCForwarded = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/dispute-manager-disputes/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDrcForwareded(response.data.latest_disputes);

        // Fetch full details for each dispute
        for (const drcForwardedItem of response.data.latest_disputes) {
          fetchDisputeDetails(drcForwardedItem.dispute);
        }
      } catch (err) {
        setError(err.response ? err.response.data.detail : 'Failed to fetch disputes');
      }
    };

    const fetchDisputeDetails = async (disputeId) => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        response.data.creator = await getUserType(response?.data.created_by)
        console.log("response data is ",response.data)
        setDisputeDetails(prevDetails => ({ ...prevDetails, [disputeId]: response.data }));
      } catch (error) {
        console.error(`Error fetching details for dispute ID ${disputeId}:`, error);
      }
    };

    fetchDRCForwarded();
  }, [token]);

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
  
  const hanldeDisputeDetails = (drcForwardedItem) => {
      navigate(`/dispute-events/${drcForwardedItem.dispute}`,{
        state:{
          drcForwardedItem:drcForwardedItem,
        }
      })
  }


  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <section className="mb-12">
        <h2 className="text-lg font-normal text-brand-dark-blue mb-6">Latest Disputes Assigned</h2>
        {drcForwarded.length === 0 ? (
          <p className="text-gray-500 text-center">No disputes assigned.</p>
        ) : (
          drcForwarded.map(drcForwardedItem => {
            const dispute = disputeDetails[drcForwardedItem.dispute];
            return (
              <div key={drcForwardedItem.id} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-normal text-gray-800">{dispute ? dispute.title : 'Loading...'}</h3>
                  <span className={`text-xs font-semibold rounded-full px-4 py-1 ${getDRCForwardedStatusStyle(drcForwardedItem?.solved)}`}>
                    {drcForwardedItem.solved ? "solved" : 'not solved'}
                  </span>
                </div>
                <p className="text-gray-600">Created By: {dispute?.creator}</p>
                <p className="text-gray-600">{dispute ? dispute.description : 'Loading description...'}</p>
                <p className="text-gray-600">Assigned Date: {new Date(drcForwardedItem.created_at).toLocaleString()}</p>
                <button
                onClick={
                  () => hanldeDisputeDetails(drcForwardedItem)
                }
                className="text-blue-600 underline hover:text-blue-800 transition duration-200">
                  View Details
                </button>
              </div>
            );
          })
        )}
      </section>
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

export default DisputeManagerDashboard;
