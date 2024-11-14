import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DrcForwardedDisputes = () => {
  const [drcForwarded, setDrcForwarded] = useState([]);
  const [disputeDetails, setDisputeDetails] = useState({});
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const disputesPerPage = 3;

  useEffect(() => {
    const fetchDRCForwarded = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/dispute-manager-disputes/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort disputes by `created_at` in descending order
        const sortedDisputes = response.data.latest_disputes
          .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
        setDrcForwarded(sortedDisputes);

        // Fetch full details for each dispute
        for (const drcForwardedItem of sortedDisputes) {
          fetchDisputeDetails(drcForwardedItem.dispute);
        }
      } catch (err) {
        setError(err.response ? err.response.data.detail : 'Failed to fetch disputes');
      }
    };

    const fetchDisputeDetails = async (disputeId) => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        response.data.creator = await getUserType(response?.data.created_by);
        setDisputeDetails((prevDetails) => ({ ...prevDetails, [disputeId]: response.data }));
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.user_type;
    } catch (error) {
      console.error(`Error fetching user type for user id ${id}:`, error);
    }
  };

  const handleDisputeDetails = (drcForwardedItem) => {
    navigate(`/dispute-events/${drcForwardedItem.dispute}`, {
      state: { drcForwardedItem: drcForwardedItem },
    });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // Calculate the start and end indexes for the current page
  const startIndex = (currentPage - 1) * disputesPerPage;
  const endIndex = startIndex + disputesPerPage;

  // Get the disputes for the current page
  const currentDisputes = drcForwarded.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(drcForwarded.length / disputesPerPage);

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

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
                  <span className={`text-xs font-semibold rounded-full px-4 py-1 ${getDRCForwardedStatusStyle(drcForwardedItem?.solved)}`}>
                    {drcForwardedItem.solved ? "solved" : 'not solved'}
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
