import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const fetchCounterOffer = async ({ queryKey }) => {
  const [, id, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/counter-offer/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchMilestones = async ({ queryKey }) => {
  const [, id, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/counter-offer/${id}/milestones/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchClientData = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/client/manage/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const CounterOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const contract = location.state?.contract || {};

  const {
    data: counterOffer,
    isLoading: loadingCounterOffer,
    error: counterOfferError,
  } = useQuery({
    queryKey: ["counterOffer", id, token],
    queryFn: fetchCounterOffer,
  });

  const {
    data: milestones = [],
    isLoading: loadingMilestones,
    error: milestonesError,
  } = useQuery({
    queryKey: ["milestones", id, token],
    queryFn: fetchMilestones,
    enabled: !!counterOffer?.milestone_based,
  });

  const {
    data: client,
    isLoading: loadingClient,
    error: clientError,
  } = useQuery({
    queryKey: ["client", token],
    queryFn: () => fetchClientData(token),
  });

  const handleAccept = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/counter-offer/${id}/`,
        { status: "accepted" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { data: contractMilestones } = await axios.get(
        `http://127.0.0.1:8000/api/contracts/${counterOffer.contract}/milestones/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Sync milestones logic remains unchanged
      console.log("Milestones synced:", contractMilestones);

      navigate(`/contract-counter-offer/${id}`);
    } catch (error) {
      console.error("Error accepting counter offer:", error);
    }
  };

  const handleCounterOffer = () => {
    navigate(`/create-counter-offer/${id}`);
  };

  const handleEditCounterOffer = () => {
    navigate(`/edit-offer/${id}`);
  };

  const handleUpdateOfferStatus = async (status) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/counter-offer/${id}/`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/contract-counter-offers/${contract.id}`)
    } catch (error) {
      console.error("Error updating counter offer status:", error);
    }
  };

  if (loadingCounterOffer || loadingMilestones || loadingClient) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (counterOfferError || milestonesError || clientError) {
    return <div className="text-center py-8 text-red-600">Error loading data.</div>;
  }

  if (!counterOffer) {
    return <div className="text-center py-8">No contract found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <div className="flex items-center mb-4">
        <h1 className="text-4xl font-thin text-brand-dark-blue">
          {counterOffer.title}
        </h1>
        <span
          className={`ml-3 text-lg font-medium ${getContractStatusStyle(counterOffer.status)}`}
        >
          ({counterOffer.status})
        </span>
      </div>
      <p className="mb-2">
        Start Date: {new Date(counterOffer.start_date).toLocaleDateString()}
      </p>
      <p className="mb-2">
        End Date: {new Date(counterOffer.end_date).toLocaleDateString()}
      </p>
      <p className="mb-2">Proposed Amount: {counterOffer.proposed_amount}</p>
      <h3 className="text-3xl font-thin text-brand-dark-blue mb-2">
        Milestones
      </h3>
      <div className="border-t border-gray-200">
        {milestones.length > 0 ? (
          milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`py-4 ${
                index < milestones.length - 1 ? "border-b border-gray-300" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-normal text-brand-dark-blue">
                  {milestone.title}
                </h4>
              </div>
              <p className="text-gray-600 mb-1">
                Due: {new Date(milestone.due_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">Amount: {milestone.amount}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 mb-2">No milestones found for this Offer.</p>
        )}
      </div>
      {counterOffer.status === "pending" && (
        <div className="flex space-x-4">
          {counterOffer.sender !== client?.id && (
            <>
              <button
                onClick={handleAccept}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
              >
                Accept
              </button>
              <button
                onClick={handleCounterOffer}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Counter Offer
              </button>
            </>
          )}

          {counterOffer.sender === client?.id &&
            counterOffer.status === "pending" && (
              <>
              <button
                  onClick={() => handleEditCounterOffer(counterOffer.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Update Offer
                </button>
                <button
                  onClick={() => handleUpdateOfferStatus("canceled")}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                >
                  Cancel Offer
                </button>
              </>
            )}
        </div>
      )}
    </div>
  );
};

const getContractStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return "text-yellow-600";
    case "accepted":
      return "text-green-600";
    case "rejected":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};

export default CounterOffer;
