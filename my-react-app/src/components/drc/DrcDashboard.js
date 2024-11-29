import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fetchDRCForwarded = async (token) => {
  const response = await axios.get('http://127.0.0.1:8000/api/dispute-manager-disputes/', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const sortedDisputes = response.data.latest_disputes
    .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
    .slice(0, 5);

  return sortedDisputes;
};

const fetchDisputeDetails = async (disputeId, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchUserType = async (userId, token) => {
  const response = await axios.post(
    `http://127.0.0.1:8000/api/user/user-type/`,
    { user_id: userId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.user_type;
};

const DisputeManagerDashboard = () => {
  const token = localStorage.getItem('access');
  const navigate = useNavigate();

  const { data: drcForwarded = [], isError, error } = useQuery({
    queryKey: ['drcForwarded', { token }],
    queryFn: () => fetchDRCForwarded(token),
  });

  const { data: disputeDetails = {}, refetch: fetchDetails } = useQuery({
    queryKey: ['disputeDetails', { drcForwarded, token }],
    queryFn: async () => {
      const details = {};
      for (const drcForwardedItem of drcForwarded) {
        const dispute = await fetchDisputeDetails(drcForwardedItem.dispute, token);
        const userType = await fetchUserType(dispute.created_by, token);
        dispute.creator = userType;
        details[drcForwardedItem.dispute] = dispute;
      }
      return details;
    },
    enabled: !!drcForwarded.length, // Fetch details only if disputes are available
  });

  const handleDisputeDetails = (drcForwardedItem) => {
    navigate(`/dispute-events/${drcForwardedItem.dispute}`, {
      state: { drcForwardedItem },
    });
  };

  if (isError) {
    return <div className="text-center py-8 text-red-500">{error.message}</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <section className="mb-12">
        <h2 className="text-lg font-normal text-brand-dark-blue mb-6">Latest Disputes Assigned</h2>
        {drcForwarded.length === 0 ? (
          <p className="text-gray-500 text-center">No disputes assigned.</p>
        ) : (
          drcForwarded.map((drcForwardedItem) => {
            const dispute = disputeDetails[drcForwardedItem.dispute];
            return (
              <div
                key={drcForwardedItem.id}
                className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-normal text-gray-800">
                    {dispute ? dispute.title : 'Loading...'}
                  </h3>
                  <span
                    className={`text-xs font-semibold rounded-full px-4 py-1 ${getDRCForwardedStatusStyle(
                      drcForwardedItem?.solved
                    )}`}
                  >
                    {drcForwardedItem.solved ? 'solved' : 'not solved'}
                  </span>
                </div>
                <p className="text-gray-600">
                  Created By: {dispute?.creator || 'Loading...'}
                </p>
                <p className="text-gray-600">
                  {dispute ? dispute.description : 'Loading description...'}
                </p>
                <p className="text-gray-600">
                  Assigned Date: {new Date(drcForwardedItem.created_at).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDisputeDetails(drcForwardedItem)}
                  className="text-blue-600 underline hover:text-blue-800 transition duration-200"
                >
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

// Helper function to get DRC forwarded dispute status styling
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
