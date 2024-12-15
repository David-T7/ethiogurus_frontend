import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ClientLayout from "./ClientLayoutPage";
import { FaUpload } from "react-icons/fa";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";

const fetchContract = async ({ queryKey }) => {
  const [, contractId, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/contracts/${contractId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchMilestone = async ({ queryKey }) => {
  const [, milestoneId, token] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/milestones/${milestoneId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const DisputePage = () => {
  const { id: contractId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const encryptedToken = localStorage.getItem("access");
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const token = decryptToken(encryptedToken, secretKey);
  const { milestoneId } = location.state || null;

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
  
  const { data: contract, isLoading: contractLoading } = useQuery({
    queryKey: ["contract", contractId, token],
    queryFn: fetchContract,
    enabled: milestoneId == null,
  });

  const { data: milestone, isLoading: milestoneLoading } = useQuery({
    queryKey: ["milestone", milestoneId, token],
    queryFn: fetchMilestone,
    enabled: !!milestoneId,
  });

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", disputeDetails);
    formData.append("return_type", refundType);
    if (refundType === "partial") {
      formData.append("return_amount", refundAmount);
    }
    formData.append("contract", contractId);
    if (milestoneId) {
      formData.append("milestone", milestoneId);
    }
    files.forEach((file) => {
      formData.append("supporting_documents", file);
    });

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/disputes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Dispute submitted successfully:", response.data);
      await handleContractStatusUpdate("inDispute");
      setSuccess(true);

      setTitle("");
      setDisputeDetails("");
      setFiles([]);
      setRefundType("full");
      setRefundAmount("");

      navigate(`/contracts/${contractId}`);
    } catch (err) {
      console.error("Error submitting dispute:", err);
      setError(err.response?.data || "Failed to submit dispute. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContractStatusUpdate = async (statusValue) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/contracts/${contractId}/`,
        { status: statusValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Contract status updated to inDispute.");
    } catch (error) {
      console.error("Error updating contract status:", error);
    }
  };

  if (contractLoading || milestoneLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-6">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6 text-center">
        File a Dispute for {milestone ? milestone.title : contract?.title}
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">Dispute submitted successfully!</div>}

      <form onSubmit={handleSubmit}>
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
            <input type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>
          <ul className="list-disc pl-6 text-brand-gray-dark mt-4">
            {files.length > 0 ? (
              Array.from(files).map((file, index) => (
                <li key={index} className="mb-2">
                  {file.name}
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
            <label htmlFor="full" className="mr-4">
              Full Refund
            </label>
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
                required
              />
          {partialRefundError && <div className="text-red-500 mt-1">{partialRefundError}</div>}

            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
  <button
    type="submit"
    className={`bg-blue-500 w-[50%] text-white px-6 py-3 rounded-lg hover:bg-brand-dark-blue transition-all duration-200 shadow-md ${
      loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
    disabled={loading}
  >
    {loading ? "Submitting..." : "Submit Dispute"}
  </button>

  {/* Display Success or Error Message */}
  {success && (
    <div className="text-green-500 mt-4 text-sm">
      Dispute submitted successfully!
    </div>
  )}
  {error && (
    <div className="text-red-500 mt-4 text-sm">
      {typeof error === "string" && error.length<=100 ? error : "An error occurred. Please try again."}
    </div>
  )}
</div>
      </form>
    </div>
  );
};

export default DisputePage;
