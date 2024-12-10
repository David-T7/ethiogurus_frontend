import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { decryptToken } from "../../utils/decryptToken";

const fetchAssessments = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/assessments/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const fetchPositionDetails = async (id, token) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/services/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Position Details Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching position details:", error);
    throw error;
  }
};

const AssessmentsPage = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

  const { data: assessments = [], isLoading, isError, error } = useQuery({
    queryKey: ["assessments", token],
    queryFn: () => fetchAssessments(token),
    enabled: !!token,
  });

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const handleSeeLess = () => {
    setVisibleCount(5);
  };

  if (isLoading) {
    return <p className="text-gray-500 text-center">Loading assessments...</p>;
  }

  if (isError) {
    return <div className="text-red-500 text-center mt-4">{error.message}</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <section className="mb-12">
        {assessments.length === 0 ? (
          <p className="text-gray-500 text-center">No assessments available.</p>
        ) : (
          assessments.slice(0, visibleCount).map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              token={token}
            />
          ))
        )}

        {assessments.length > visibleCount && (
          <button
            onClick={handleSeeMore}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            See More
          </button>
        )}

        {visibleCount > 5 && (
          <button
            onClick={handleSeeLess}
            className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
          >
            See Less
          </button>
        )}
      </section>
    </div>
  );
};

const AssessmentCard = ({ assessment , token }) => {
  const { data: positionDetails, isLoading: isPositionLoading } = useQuery({
    queryKey: ["positionDetails", assessment.applied_position, token],
    queryFn: () => fetchPositionDetails(assessment.applied_position,token),
  });

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-normal text-gray-800">
          {assessment.finished ? "Completed" : "In Progress"} Assessment
        </h3>
        <span
          className={`text-xs font-semibold rounded-full px-4 py-1 text-white ${
            assessment.finished
              ? "bg-green-500"
              : assessment.on_hold
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
        >
          {assessment.finished || assessment.on_hold
            ? assessment.status === "passed"
              ? "Passed"
              : "Failed"
            : "In Progress"}
        </span>
      </div>
      <p className="text-gray-600">
        Applied Position:{" "}
        {isPositionLoading ? "Loading..." : positionDetails?.name || "Unknown"}
      </p>

      <p className="text-gray-600">
        Start Date: {new Date(assessment.created_at).toLocaleString()}
      </p>

      <div className="mt-2">
        <p className="text-gray-600">
          Soft Skills Assessment Status:{" "}
          <span
            className={`font-semibold ${
              assessment.soft_skills_assessment_status === "passed"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {assessment.soft_skills_assessment_status.replace("_", " ")}
          </span>
        </p>
        <p className="text-gray-600">
          Depth Skill Assessment Status:{" "}
          <span
            className={`font-semibold ${
              assessment.depth_skill_assessment_status === "passed"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {assessment.depth_skill_assessment_status.replace("_", " ")}
          </span>
        </p>
        <p className="text-gray-600">
          Live Assessment Status:{" "}
          <span
            className={`font-semibold ${
              assessment.live_assessment_status === "passed"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {assessment.live_assessment_status.replace("_", " ")}
          </span>
        </p>
      </div>

      <Link
        to={{ pathname: `/assessment/${assessment.id}` }}
        className="text-blue-500 hover:underline mt-4 inline-block"
      >
        View Details
      </Link>
    </div>
  );
};

export default AssessmentsPage;
