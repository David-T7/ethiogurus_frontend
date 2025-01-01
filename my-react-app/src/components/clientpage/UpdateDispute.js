import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
import ConfirmationModal from './ConfirmationModal';

const fetchDispute = async ({ queryKey }) => {
  const [, disputeId, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchCheckDisputeInDrc = async ({ queryKey }) => {
  const [, disputeId, token] = queryKey;

  // Make a GET request with the dispute_id as a query parameter
  const response = await axios.get(`http://127.0.0.1:8000/check-dispute-in-drc/`, {
    params: { dispute_id: disputeId }, // dispute_id as query param
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.is_in_drc_forwarded;
};



const UpdateDispute = () => {
  const { id: disputeId } = useParams(); // Get dispute ID from URL
  const navigate = useNavigate();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [title, setTitle] = useState("");
  const [disputeDetails, setDisputeDetails] = useState("");
  const [files, setFiles] = useState([]);
  const [refundType, setRefundType] = useState("full");
  const [refundAmount, setRefundAmount] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [partialRefundError, setPartialRefundError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch dispute details using useQuery
  const { data: dispute, isLoading, isError } = useQuery({
    queryKey: ["dispute", disputeId, token],
    queryFn: fetchDispute,
  });

  // Fetch dispute details using useQuery
  const { data: is_in_drc_forwarded, isDrcLoading, isDrcError } = useQuery({
    queryKey: ["dispute-in-drc", disputeId, token],
    queryFn: fetchCheckDisputeInDrc,
  });

  useEffect(() => {
    setTitle(dispute?.title);
    setDisputeDetails(dispute?.description);
    setRefundType(dispute?.return_type);
    setRefundAmount(dispute?.return_amount || "");
  } , [dispute])

  // Handle file selection
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    if (!title.trim()) {
      setTitleError("Title is required.");
      valid = false;
    } else {
      setTitleError("");
    }

    if (!disputeDetails.trim()) {
      setDescriptionError("Description is required.");
      valid = false;
    } else {
      setDescriptionError("");
    }

    if (refundType === "partial" && !refundAmount) {
      setPartialRefundError("Please specify the refund amount for a partial refund.");
      valid = false;
    }
    else{
    setPartialRefundError("")
    }

    if (!valid) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    

    setError(null);
    setSuccess(false);

    // Create FormData object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", disputeDetails);
    formData.append("return_type", refundType);
    if (refundType === "partial") {
      formData.append("return_amount", refundAmount);
    }
    files.forEach((file) => {
      formData.append("supporting_documents", file);
    });

    try {
      await axios.patch(`http://127.0.0.1:8000/api/disputes/${disputeId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
      navigate(-1); // Go back to the previous page
    } catch (err) {
      setError(err.response?.data || "Failed to update dispute. Please try again.");
    }
  };

  const handleCancelDispute = async () =>{
    try {
      await axios.patch(`http://127.0.0.1:8000/api/disputes/${disputeId}/`,
        {
          status: "cancelled"
        } 
        ,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
      navigate(-1); // Go back to the previous page
    }
    catch(error){
      setError(error.response?.data || "Failed to cancel dispute. Please try again.");

    }
  }
  const handleCancel = () => {
    console.log('Cancelled!');
    setModalOpen(false);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading dispute details...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Error fetching dispute details.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-6">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
        Update Dispute
      </h1>
      <form onSubmit={handleSubmit}>
        {/* Dispute Title */}
        <div className="p-6">
          <label htmlFor="title" className="block text-lg font-normal text-brand-blue mb-2">
            Dispute Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter dispute title..."
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
            {titleError && <div className="text-red-500 mt-1">{titleError}</div>}

        </div>

        {/* Dispute Details */}
        <div className="p-6">
          <label htmlFor="details" className="block text-lg font-normal text-brand-blue mb-2">
            Dispute Details
          </label>
          <textarea
            id="details"
            value={disputeDetails}
            onChange={(e) => setDisputeDetails(e.target.value)}
            placeholder="Describe your issue here..."
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
          />
          {descriptionError && <div className="text-red-500 mt-1">{descriptionError}</div>}

        </div>

        {/* Upload Evidence Documents */}
        <div className="p-6">
          <h2 className="text-lg font-normal text-brand-blue mb-2">Upload Evidence Documents</h2>
          <label className="flex flex-col items-center cursor-pointer">
            <div className="flex items-center justify-center w-full h-24 border-2 border-dashed border-brand-dark-blue bg-brand-gray-light rounded-lg mb-4">
              <FaUpload className="text-3xl text-brand-dark-blue" />
              <span className="text-brand-dark-blue ml-2">Drag & Drop your files here</span>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <ul className="list-disc pl-6 text-brand-gray-dark mt-4">
            {files.length > 0 ? (
              Array.from(files).map((file, index) => (
                <li key={index} className="mb-2">
                  <span className="font-normal">{file.name}</span>
                </li>
              ))
            ) : (
              <li>No files selected</li>
            )}
          </ul>
        </div>

        {/* Refund Type */}
        <div className="p-6">
          <label htmlFor="refundType" className="block text-lg font-normal text-brand-blue mb-2">
            Refund Type
          </label>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="full"
              name="refundType"
              value="full"
              checked={refundType === "full"}
              onChange={() => setRefundType("full")}
              className="mr-2"
            />
            <label htmlFor="full" className="mr-4">Full Refund</label>
            <input
              type="radio"
              id="partial"
              name="refundType"
              value="partial"
              checked={refundType === "partial"}
              onChange={() => setRefundType("partial")}
              className="mr-2"
            />
            <label htmlFor="partial">Partial Refund</label>
          </div>

          {refundType === "partial" && (
            <div>
              <label htmlFor="refundAmount" className="block text-lg font-normal text-brand-blue mb-2">
                Amount for Partial Refund
              </label>
              <input
                type="number"
                id="refundAmount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
                {partialRefundError && <div className="text-red-500 mt-1">{partialRefundError}</div>}

            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center flex space-x-4 justify-center">
        <button
    type="submit"
    className={`bg-blue-500 w-[30%] text-white px-6 py-3 rounded-lg hover:bg-brand-dark-blue transition-all duration-200 shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    disabled={isLoading}
  >
    {isLoading ? "Submitting..." : "Update Dispute"}
  </button>
  
  {!is_in_drc_forwarded && dispute.status === "open" && <button
    type="button" // Use "button" if it's not a form submit
    onClick={() => setModalOpen(true)}
    className={`bg-red-500 w-[30%] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    disabled={isLoading}
  >
    {isLoading ? "Cancelling..." : "Cancel Dispute"}
  </button>
}
</div>
        
        {/* Display Success or Error Message */}
  {success && (
    <div className="text-green-500 text-center mt-4 text-md">
      Dispute Updated successfully!
    </div>
  )}
  {error && (
    <div className="text-red-500 mt-4 text-center text-md">
      {typeof error === "string" && error.length<=100 ? error : "An error occurred. Please try again."}
    </div>
  )}
      </form>

       {/* Cancel Confirmation Modal */}
       {isModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to proceed?"
          onConfirm={handleCancelDispute}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default UpdateDispute;
