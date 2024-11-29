import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDisputeResponseDetails = async ({ queryKey }) => {
  const [_, { responseId, token }] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/dispute-response/${responseId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const DrcDisputeResponseDetails = () => {
  const { id: responseId } = useParams();
  const token = localStorage.getItem("access");
  const location = useLocation();
  const { drcForwardedItem } = location.state || null;

  const { data: responseDetails, isLoading, isError, error } = useQuery({
    queryKey: ["disputeResponseDetails", { responseId, token }],
    queryFn: fetchDisputeResponseDetails,
  });

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (isError) return <div className="text-center text-red-500 mt-8">{error?.message || "Failed to load response details."}</div>;

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Dispute Response Details</h1>

      {/* Display Response Details */}
      <div className="dispute-card bg-white p-4 border border-gray-200 rounded-lg mb-6 shadow-sm relative">
        <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center right-14 top-4">
          <span
            className={`text-xs font-semibold rounded-full px-4 py-1 ${getDisputeResponseStatus(responseDetails.got_response)}`}
            style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
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
            {responseDetails.return_type === "full" ? "Full Refund Offer" : "Partial Refund Offer"}
          </p>
          <p className="text-gray-800">Amount: {responseDetails.return_amount} Birr</p>
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
    </div>
  );
};

const getDisputeResponseStatus = (got_response) => {
  switch (got_response) {
    case true:
      return "bg-yellow-500 text-black";
    case false:
      return "bg-red-500 text-black";
    default:
      return "bg-gray-300 text-black";
  }
};

export default DrcDisputeResponseDetails;
