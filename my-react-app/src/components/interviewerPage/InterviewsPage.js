import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
// Fetch interviews and their associated data
const fetchInterviews = async ({ queryKey }) => {
  const [, { token }] = queryKey;

  const interviewsResponse = await axios.get(
    "http://127.0.0.1:8000/api/interviewer/interviews/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const interviews = interviewsResponse.data.interviews;

  const freelancerRequests = [];
  const appointmentRequests = [];

  // Gather unique freelancer and appointment IDs
  const freelancerIds = new Set();
  const appointmentIds = new Set();

  interviews.forEach((interview) => {
    if (!freelancerIds.has(interview.freelancer)) {
      freelancerIds.add(interview.freelancer);
      freelancerRequests.push(
        axios.get(
          `http://127.0.0.1:8000/api/user/freelancer/${interview.freelancer}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
    }
    if (!appointmentIds.has(interview.appointment)) {
      appointmentIds.add(interview.appointment);
      appointmentRequests.push(
        axios.get(
          `http://127.0.0.1:8000/api/appointments/${interview.appointment}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );
    }
  });

  const freelancerResponses = await Promise.all(freelancerRequests);
  const appointmentResponses = await Promise.all(appointmentRequests);

  // Map freelancer and appointment data by ID
  const freelancerDataMap = Object.fromEntries(
    freelancerResponses.map((res, i) => [Array.from(freelancerIds)[i], res.data])
  );
  const appointmentDataMap = Object.fromEntries(
    appointmentResponses.map((res, i) => [Array.from(appointmentIds)[i], res.data])
  );

  // Combine interview data with freelancer and appointment data
  return interviews.map((interview) => ({
    ...interview,
    freelancer_data: freelancerDataMap[interview.freelancer],
    appointment_data: appointmentDataMap[interview.appointment],
  }));
};

const InterviewsPage = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 interviews

  const { data: interviews = [], isLoading, error } = useQuery({
    queryKey: ["interviews", { token }],
    queryFn: fetchInterviews,
  });

  // Filtering logic
  const handleFilter = () => {
    const today = new Date();

    // Define date ranges for filtering
    const dateRanges = {
      this_week: {
        start: new Date(today.setDate(today.getDate() - today.getDay())),
        end: new Date(today.setDate(today.getDate() + (6 - today.getDay()))),
      },
      next_week: {
        start: new Date(today.setDate(today.getDate() + 7)),
        end: new Date(today.setDate(today.getDate() + 13)),
      },
      this_month: {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      },
      next_month: {
        start: new Date(today.getFullYear(), today.getMonth() + 1, 1),
        end: new Date(today.getFullYear(), today.getMonth() + 2, 0),
      },
      last_month: {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      },
    };

    return interviews.filter((interview) => {
      const appointmentDate = new Date(interview.appointment_data?.appointment_date);

      // Search filter
      const matchesSearch =
        interview.freelancer_data?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.interviewer?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        !statusFilter ||
        (statusFilter === "passed" && interview.passed && interview.done) ||
        (statusFilter === "not_passed" && !interview.passed && interview.done) ||
        (statusFilter === "pending" && !interview.done);

      // Duration filter
      const matchesDuration =
        !durationFilter ||
        (appointmentDate >= dateRanges[durationFilter]?.start &&
          appointmentDate <= dateRanges[durationFilter]?.end);

      return matchesSearch && matchesStatus && matchesDuration;
    });
  };

  const filteredInterviews = handleFilter();

  // Loading and Error states
  if (isLoading) return <div className="text-center py-8">Loading interviews...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        {error.response?.data.detail || "Failed to fetch interviews"}
      </div>
    );

  // Pagination logic
  const handleSeeMore = () => setVisibleCount((prev) => prev + 5);
  const handleSeeLess = () => setVisibleCount(5);

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      {/* Filter Section */}
      <section className="mb-6">
        <input
          type="text"
          placeholder="Search by freelancer name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[40%] border mr-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border mr-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="passed">Passed</option>
          <option value="not_passed">Not Passed</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
          className="border mr-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">All Dates</option>
          <option value="this_week">This Week</option>
          <option value="next_week">Next Week</option>
          <option value="this_month">This Month</option>
          <option value="next_month">Next Month</option>
          <option value="last_month">Last Month</option>
        </select>
      </section>

      {/* Interviews Section */}
      <section className="mb-12">
        {filteredInterviews.length === 0 ? (
          <p className="text-gray-500 text-center">No interviews found.</p>
        ) : (
          filteredInterviews.slice(0, visibleCount).map((interview) => (
            <div
              key={interview.id}
              className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-normal text-gray-800">
                  {interview.appointment_data?.category} Interview
                </h3>
                <span
                  className={`text-xs font-semibold rounded-full px-4 py-1 text-white ${
                    interview.done
                      ? interview.passed
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-blue-500"
                  }`}
                >
                  {interview.done
                    ? interview.passed
                      ? "Passed"
                      : "Not Passed"
                    : "Pending"}
                </span>
              </div>
              <p className="text-gray-600">
                Freelancer: {interview.freelancer_data?.full_name}
              </p>
              <p className="text-gray-600">
                Appointment Date:{" "}
                {new Date(interview.appointment_data?.appointment_date).toLocaleString()}
              </p>
              <p className="text-gray-600">
                Interview Type: {interview.appointment_data?.interview_type}
              </p>

              <Link to={`/interview/${interview.id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          ))
        )}

        {/* Pagination Buttons */}
        {filteredInterviews.length > visibleCount && (
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
    </div>
  );
};

export default InterviewsPage;
