import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("access"); // Get the access token from localStorage

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/freelancer-projects/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );
        setProject(response.data);
      } catch (err) {
        setError("Failed to load project details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    const fetchProjectMilestones = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/milestones/project/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
        );
        setMilestones(response.data);
      } catch (err) {
        setError("Failed to load project milestones. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectMilestones();
  }, [id]);

  const requestApproval = (milestoneId) => {
    setProject((prevProject) => {
      const updatedMilestones = prevProject.milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, approvalRequested: true }
          : milestone
      );
      return { ...prevProject, milestones: updatedMilestones };
    });
    // Replace with API call to request milestone approval
    alert(`Approval requested for milestone ID: ${milestoneId}`);
  };

  const requestProjectApproval = () => {
    // Replace with API call to request project approval
    alert("Approval requested for the entire project.");
  };

  const handleRespondToDispute = () => {
    navigate(`/dispute-response/${id}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading project details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!project) {
    return <div className="text-center py-8">No project found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-normal text-brand-dark-blue">
          {project.title}
        </h1>
      </div>
      <p className="text-gray-700 mb-6">{project.description}</p>
      <h2 className="text-xl font-normal text-brand-dark-blue mb-4">
        Deadline
      </h2>
      <p className="text-gray-700 mb-6">{project?.deadline || "Not Set"}</p>

      {/* Respond to Dispute Button */}
      {project.status === "In Dispute" && (
        <div className="mb-6">
          <p className="font-normal text-red-600 flex items-center">
            <FaExclamationTriangle className="mr-2" /> This project is currently
            in dispute.
          </p>
          <button
            onClick={handleRespondToDispute}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 mt-4"
          >
            Respond to Dispute
          </button>
        </div>
      )}

      {/* Approval Section for Projects without Milestones */}
      {project.milestones && project.milestones.length === 0 && (
        <div className="mb-6">
          <p className="font-normal">
            This project does not have any milestones. Please request approval
            for the entire project.
          </p>
          <button
            onClick={requestProjectApproval}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mt-4"
          >
            Request Approval
          </button>
        </div>
      )}

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

              {milestone.status === "Active" && (
                <button
                  onClick={() => requestApproval(milestone.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                  Request Approval
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600 mb-2">
            No milestones found for this Offer.
          </p>
        )}
      </div>
    </div>
  );
};

// Helper function to get milestone status styling
const getMilestoneStatusStyle = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-500 text-white";
    case "Active":
      return "bg-yellow-500 text-black";
    default:
      return "bg-gray-300 text-black";
  }
};

// Helper function to get project status styling
const getProjectStatusStyle = (status) => {
  switch (status) {
    case "Completed":
      return "text-green-600";
    case "Active":
      return "text-blue-600";
    case "In Dispute":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};

export default ProjectDetails;
