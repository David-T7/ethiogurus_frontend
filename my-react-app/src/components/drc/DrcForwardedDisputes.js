import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';
const fetchDRCForwarded = async ({ queryKey }) => {
  const [_, token] = queryKey;
  const response = await axios.get('http://127.0.0.1:8000/api/dispute-manager-disputes/', {
    headers: { Authorization: `Bearer ${token}` },
  });

  const sortedDisputes = response.data.latest_disputes.sort(
    (a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
  );

  return sortedDisputes;
};

const fetchDisputeDetails = async ({ queryKey }) => {
  const [_, { disputeId, token }] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const userTypeResponse = await axios.post(
    `http://127.0.0.1:8000/api/user/user-type/`,
    { user_id: response.data.created_by },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  response.data.creator = userTypeResponse.data.user_type;
  return response.data;
};

const DrcForwardedDisputes = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const navigate = useNavigate();
  const disputesPerPage = 3;

  const [currentPage, setCurrentPage] = useState(1);

  const { data: drcForwarded = [], isError, error } = useQuery({
    queryKey: ['drcForwardedDisputes', token],
    queryFn: fetchDRCForwarded,
  });

  const { data: disputeDetails = {}, isFetching: isFetchingDetails } = useQuery({
    queryKey: ['disputeDetails', { disputeId: drcForwarded.map((item) => item.dispute), token }],
    queryFn: async () => {
      const details = {};
      await Promise.all(
        drcForwarded.map(async (item) => {
          details[item.dispute] = await fetchDisputeDetails({ queryKey: ['', { disputeId: item.dispute, token }] });
        })
      );
      return details;
    },
    enabled: drcForwarded.length > 0, // Run only if disputes are fetched
  });

  const handleDisputeDetails = (drcForwardedItem) => {
    navigate(`/dispute-events/${drcForwardedItem.dispute}`, {
      state: { drcForwardedItem },
    });
  };

  const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setCurrentPage((prevPage) => prevPage - 1);

  // Pagination logic
  const startIndex = (currentPage - 1) * disputesPerPage;
  const endIndex = startIndex + disputesPerPage;
  const currentDisputes = drcForwarded.slice(startIndex, endIndex);
  const totalPages = Math.ceil(drcForwarded.length / disputesPerPage);

  if (isError) return <div className="text-center py-8 text-red-500">{error.message}</div>;

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <section className="mb-12">
        <h2 className="text-2xl font-thin text-brand-dark-blue mb-6">Forwarded Disputes</h2>
        {currentDisputes.length === 0 ? (
          <p className="text-gray-500 text-center">No disputes assigned.</p>
        ) : (
          currentDisputes.map((drcForwardedItem) => {
            const dispute = disputeDetails[drcForwardedItem.dispute];
            return (
              <div key={drcForwardedItem.id} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-normal text-gray-800">
                    {dispute ? dispute.title : 'Loading...'}
                  </h3>
                  <span
                    className={`text-xs font-semibold rounded-full px-4 py-1 ${getDRCForwardedStatusStyle(
                      drcForwardedItem.solved
                    )}`}
                  >
                    {drcForwardedItem.solved ? 'Solved' : 'Not Solved'}
                  </span>
                </div>
                <p className="text-gray-600">Created By: {dispute?.creator}</p>
                <p className="text-gray-600">{dispute ? dispute.description : 'Loading description...'}</p>
                <p className="text-gray-600">Assigned Date: {new Date(drcForwardedItem.created_at).toLocaleString()}</p>
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

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
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

export default DrcForwardedDisputes;
