import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 assessments
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/assessments/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Convert object to array if needed and set state
        const assessmentsData = response.data.reduce((acc, assessment) => {
          acc.push(assessment); // Push assessments into an array
          return acc;
        }, []);

        setAssessments(assessmentsData);
      } catch (err) {
        setError(err.response ? err.response.data.detail : 'Failed to fetch assessments');
      }
    };

    fetchAssessments();
  }, [token]);

  // Function to handle "See More" and "See Less" functionality
  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Show more assessments
  };

  const handleSeeLess = () => {
    setVisibleCount(5); // Reset to show only the first 5 assessments
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      {/* Latest Assessments Section */}
      <section className="mb-12">
        {assessments.length === 0 ? (
          <p className="text-gray-500 text-center">No assessments available.</p>
        ) : (
          assessments.slice(0, visibleCount).map((assessment) => (
            <div key={assessment.id} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
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
    ? assessment.passed
      ? "Passed"
      : "Failed"
    : "In Progress"}
</span>
              </div>
              <p className="text-gray-600">Start Date: {new Date(assessment.created_at).toLocaleString()}</p>

              <div className="mt-2">
                <p className="text-gray-600">
                  Soft Skills Assessment:{" "}
                  <span className={`font-semibold ${assessment.soft_skills_assessment ? "text-green-500" : "text-red-500"}`}>
                    {assessment.soft_skills_assessment ? "Completed" : "Not Completed"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Depth Skill Assessment:{" "}
                  <span className={`font-semibold ${assessment.depth_skill_assessment ? "text-green-500" : "text-red-500"}`}>
                    {assessment.depth_skill_assessment ? "Completed" : "Not Completed"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Live Assessment:{" "}
                  <span className={`font-semibold ${assessment.live_assessment ? "text-green-500" : "text-red-500"}`}>
                    {assessment.live_assessment ? "Completed" : "Not Completed"}
                  </span>
                </p>
              </div>

              <Link  to={{ pathname: `/assessment/${assessment.id}`}}
                    className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          ))
        )}

        {assessments.length > visibleCount && (
          <button onClick={handleSeeMore} className="bg-blue-500 text-white px-4 py-2 rounded">
            See More
          </button>
        )}

        {visibleCount > 5 && (
          <button onClick={handleSeeLess} className="bg-gray-500 text-white px-4 py-2 rounded mt-2">
            See Less
          </button>
        )}
      </section>

      {/* Error Handling */}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
};

export default AssessmentsPage;
