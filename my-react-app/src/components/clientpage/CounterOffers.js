import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchClientData = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/user/client/manage/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const CounterOffers = () => {
  const token = localStorage.getItem("access");
  const location = useLocation();
  const counterOffers = location.state?.counterOffers || [];
  const contract = location.state?.contract || {};
  const navigate = useNavigate();

  const { data: client, isLoading, error } = useQuery({
    queryKey: ["client", token],
    queryFn: () => fetchClientData(token),
    enabled: !!token,
  });

  if (!token) {
    navigate("/login");
    return null;
  }

  const handleCounterOffer = (id) => {
    navigate(`/contract-counter-offer/${id}`, {
      state: {
        contract,
        counterOffers,
      },
    });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading counter offers...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        Failed to load counter offers. Please try again later.
      </div>
    );
  }

  if (counterOffers.length === 0) {
    return <div className="text-center py-8">No counter offers found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Counter Offers</h1>
      {counterOffers.map((offer) => (
        <div
          key={offer.id}
          className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-normal text-brand-dark-blue">{offer.title}</h3>
            <span
              className={`text-xs font-semibold rounded-full px-4 py-1 ${getOfferStatusStyle(
                offer.status
              )}`}
            >
              {offer.status}
            </span>
          </div>
          <p className="text-gray-600">Proposed Amount: {offer.proposed_amount} Birr</p>
          <p className="text-gray-600">Milestone Based: {offer.milestone_based ? "Yes" : "No"}</p>
          <button
            onClick={() => handleCounterOffer(offer.id)}
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper function to get offer status styling
const getOfferStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-600 text-black";
    case "accepted":
      return "bg-green-600 text-white";
    case "rejected":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export default CounterOffers;
