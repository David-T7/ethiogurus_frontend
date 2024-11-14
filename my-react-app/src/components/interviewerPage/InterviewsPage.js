import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Combined status filter
  const [durationFilter, setDurationFilter] = useState('');
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 interviews
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/interviews/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Create sets to track fetched IDs
        const freelancerIds = new Set();
        const appointmentIds = new Set();
        const interviewsData = {};

        // Prepare requests for unique freelancer and appointment data
        const freelancerRequests = [];
        const appointmentRequests = [];

        for (const interview of response.data) {
          // Only fetch freelancer data if it hasn't been fetched yet
          if (!freelancerIds.has(interview.freelancer)) {
            freelancerIds.add(interview.freelancer);
            freelancerRequests.push(
              axios.get(`http://127.0.0.1:8000/api/user/freelancer/${interview.freelancer}/`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then(freelancerResponse => ({
                id: interview.freelancer,
                data: freelancerResponse.data,
              }))
            );
          }

          // Only fetch appointment data if it hasn't been fetched yet
          if (!appointmentIds.has(interview.appointment)) {
            appointmentIds.add(interview.appointment);
            appointmentRequests.push(
              axios.get(`http://127.0.0.1:8000/api/appointments/${interview.appointment}/`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then(appointmentResponse => ({
                id: interview.appointment,
                data: appointmentResponse.data,
              }))
            );
          }
        }

        // Execute all freelancer requests
        const freelancerResponses = await Promise.all(freelancerRequests);
        const appointmentResponses = await Promise.all(appointmentRequests);

        // Create a map for freelancer data
        const freelancerDataMap = freelancerResponses.reduce((acc, { id, data }) => {
          acc[id] = data;
          return acc;
        }, {});

        // Create a map for appointment data
        const appointmentDataMap = appointmentResponses.reduce((acc, { id, data }) => {
          acc[id] = data;
          return acc;
        }, {});

        // Combine interview data with fetched freelancer and appointment data
        for (const interview of response.data) {
          interviewsData[interview.id] = {
            freelancer_data: freelancerDataMap[interview.freelancer],
            appointment_data: appointmentDataMap[interview.appointment],
            ...interview,
          };
        }

        setInterviews(interviewsData);
        console.log("interview data is", interviewsData);
      } catch (err) {
        setError(err.response ? err.response.data.detail : 'Failed to fetch interviews');
      }
    };

    fetchInterviews();
  }, [token]);

  // Function to handle filtering interviews
  const handleFilter = () => {
    const today = new Date();

    // Define date ranges for filtering
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of this week
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // End of this week

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7); // Start of next week
    const nextWeekEnd = new Date(today);
    nextWeekEnd.setDate(today.getDate() + 13); // End of next week

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of this month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of this month

    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1); // Start of next month
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0); // End of next month

    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Start of last month
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0); // End of last month

    const matchesSearch = (interview) => {
      const freelancerName = interview?.freelancer_data?.full_name ? interview.freelancer_data.full_name.toLowerCase() : '';
      const interviewerName = interview.interviewer ? interview.interviewer.toLowerCase() : '';

      return freelancerName.includes(searchTerm.toLowerCase()) || interviewerName.includes(searchTerm.toLowerCase());
    };

    const matchesStatus = (interview) => {
      // No status filter applied
      if (!statusFilter) return true; 

      // Handle combined filter logic
      if (statusFilter === 'passed') return interview.passed && interview.done; // Passed and Done
      if (statusFilter === 'not_passed') return !interview.passed && interview.done; // Not Passed and Done
      if (statusFilter === 'pending') return !interview.done; // Only Pending interviews
      return true; // If statusFilter doesn't match any case, return all interviews
    };

    const matchesDuration = (interview) => {
      const appointmentDate = new Date(interview.appointment_data.appointment_date);

      switch (durationFilter) {
        case 'this_week':
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        case 'next_week':
          return appointmentDate >= nextWeekStart && appointmentDate <= nextWeekEnd;
        case 'this_month':
          return appointmentDate >= startOfMonth && appointmentDate <= endOfMonth;
        case 'next_month':
          return appointmentDate >= nextMonthStart && appointmentDate <= nextMonthEnd;
        case 'last_month':
          return appointmentDate >= lastMonthStart && appointmentDate <= lastMonthEnd;
        default:
          return true; // No duration filter applied
      }
    };

    return Object.values(interviews).filter((interview) =>
      matchesSearch(interview) && matchesStatus(interview) && matchesDuration(interview)
    );
  };

  const filteredInterviews = handleFilter();

  // Function to handle "See More" and "See Less" functionality
  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Increase visible count by 5
  };

  const handleSeeLess = () => {
    setVisibleCount(5); // Reset to show only the first 5
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      {/* Filter and Search Section */}
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

      {/* Latest Interviews Section */}
      <section className="mb-12">
        {filteredInterviews.length === 0 ? (
          <p className="text-gray-500 text-center">No upcoming interviews.</p>
        ) : (
          filteredInterviews.slice(0, visibleCount).map(interview => (
            <div key={interview.id} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-normal text-gray-800">{interview.appointment_data.category} Interview </h3>
                <span className={`text-xs font-semibold rounded-full px-4 py-1 text-white ${interview.done ? interview.passed ? "bg-green-500" : "bg-red-500":"bg-blue-500"}`}>
                  {interview.done ? interview.passed ? "Passed" : "Not Passed" : "Pending"}
                </span>
              </div>
              <p className="text-gray-600">Freelancer: {interview.freelancer_data.full_name}</p>
              <p className="text-gray-600">Appointment Date: {new Date(interview.appointment_data.appointment_date).toLocaleString()}</p>
              <p className="text-gray-600">Interview Type: {interview.appointment_data.interview_type}</p>

              <Link to={`/interview/${interview.id}`} className="text-blue-500 hover:underline">
                View Details
              </Link>
            </div>
          ))
        )}

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

      {/* Error Handling */}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
};

export default InterviewsPage;
