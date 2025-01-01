import React from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from '../../utils/decryptToken';

const fetchProject = async ({ queryKey }) => {
  const [, { id, token }] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/freelancer-projects/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchProjectMilestones = async ({ queryKey }) => {
  const [, { id, token }] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/freelancer-milestones/project/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchProjectContract = async ({ queryKey }) => {
  const [, { id, token }] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/freelancer-contract/project/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("project contract is ",response.data)
  return response.data;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [successMessage , setSuccessMessage] = useState("");
  const [errorMessage , setErrorMessage] = useState("");

  // Fetch project data
  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useQuery({
    queryKey: ["project", { id, token }],
    queryFn: fetchProject,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Disable refetching on tab focus
  });

  // Fetch milestones data
  const {
    data: milestones = [],
    isLoading: milestonesLoading,
    isError: milestonesError,
  } = useQuery({
    queryKey: ["milestones", { id, token }],
    queryFn: fetchProjectMilestones,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Disable refetching on tab focus
  });

  // Fetch milestones data
  const {
    data: contract = [],
    isLoading: contractLoading,
    isError: contractError,
  } = useQuery({
    queryKey: ["contracts", { id, token }],
    queryFn: fetchProjectContract,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Disable refetching on tab focus
  });

  const requestApproval = async (milestoneId) => {
    try{
    await axios.patch(`http://127.0.0.1:8000/api/freelancer-milestones-update/${milestoneId}/`,
      {status: "pendingApproval"},{
      headers: { Authorization: `Bearer ${token}` },
    });
    setSuccessMessage("request approval sent.")
  } catch (err) { 
    setErrorMessage(
      err.response?.data?.detail || "Failed to send request approval."
    );
  }
  };

  const requestProjectApproval = async() => {
    try{
      await axios.patch(`http://127.0.0.1:8000/api/freelancer-contracts-update/${contract[0]?.id}/`,
        {status: "pendingApproval"},{
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("request approval sent.")
    } catch (err) { 
      setErrorMessage(
        err.response?.data?.detail || "Failed to send request approval."
      );
    }
  };

  const handleRespondToDispute = () => {
    navigate(`/dispute-response/${id}`);
  };

  if (projectLoading || milestonesLoading || contractLoading) {
    return <div className="text-center py-8">Loading project details...</div>;
  }

  if (projectError || contractError) {
    return <div className="text-center py-8 text-red-600">Failed to load data. Please try again later.</div>;
  }

  if (!project) {
    return <div className="text-center py-8">No project found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-normal text-brand-dark-blue">{project.title}</h1>
      </div>
      <p className="text-gray-700 mb-6">{project.description}</p>
      <h2 className="text-xl font-normal text-brand-dark-blue mb-4">Deadline</h2>
      <p className="text-gray-700 mb-6">{project.deadline || "Not Set"}</p>

      {project.status === "In Dispute" && (
        <div className="mb-6">
          <p className="font-normal text-red-600 flex items-center">
            <FaExclamationTriangle className="mr-2" /> This project is currently in dispute.
          </p>
          <button
            onClick={handleRespondToDispute}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 mt-4"
          >
            Respond to Dispute
          </button>
        </div>
      )}

      <div className="border-t border-gray-200">
        {milestones.length > 0 ? (
          milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex items-center mb-4 relative">
              <div className="absolute w-4 h-4 bg-blue-600 rounded-full text-white flex items-center justify-center -left-2">
                {index + 1}
              </div>
              <div className="ml-8 bg-white p-4 border border-gray-200 rounded-lg shadow-md">
                <h3 className="text-xl font-normal text-gray-800">{milestone.title}</h3>
                <p className="text-gray-600">Due Date: {new Date(milestone.due_date).toLocaleDateString()}</p>
                <p className="text-gray-600">Amount: {milestone.amount} Birr</p>
                <p className="text-gray-600">Status: {milestone.status}</p>

                {milestone.status === "active" && (
                  <button
                    onClick={() => requestApproval(milestone.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                  >
                    Request Approval
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <>
            <p className="text-gray-600 mb-2">No milestones found for this Offer.</p>
            <button
              onClick={requestProjectApproval}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mt-4"
            >
              Request Approval
            </button>
            {successMessage && (
    <div className="text-green-500 mt-4 text-md">
      {successMessage}
    </div>
  )}
  {errorMessage && (
    <div className="text-red-500 mt-4 text-md">
      {typeof errorMessage === "string" && errorMessage.length<=100 ? errorMessage : "An error occurred. Please try again."}
    </div>
  )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
