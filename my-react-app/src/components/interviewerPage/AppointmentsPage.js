import React, { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const fetchAppointments = async ({ queryKey }) => {
  const [_, { token }] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/interviewer/appointments/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("appointments are ",response.data.appointments)
  return response.data.appointments;

};

const AppointmentsPage = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 appointments
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch appointments using TanStack Query v5+
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["appointments", { token }],
    queryFn: fetchAppointments,
  });

  // Function to filter appointments
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

    const matchesSearch = (appointment) =>
      appointment.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = (appointment) =>
      !statusFilter ||
      (statusFilter === "done" ? appointment.done : !appointment.done);

    const matchesDuration = (appointment) => {
      const appointmentDate = new Date(appointment.appointment_date);

      switch (durationFilter) {
        case "this_week":
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        case "next_week":
          return (
            appointmentDate >= nextWeekStart && appointmentDate <= nextWeekEnd
          );
        case "this_month":
          return (
            appointmentDate >= startOfMonth && appointmentDate <= endOfMonth
          );
        case "next_month":
          return (
            appointmentDate >= nextMonthStart && appointmentDate <= nextMonthEnd
          );
        case "last_month":
          return (
            appointmentDate >= lastMonthStart &&
            appointmentDate <= lastMonthEnd
          );
        default:
          return true; // No duration filter applied
      }
    };

    return appointments.filter(
      (appointment) =>
        matchesSearch(appointment) &&
        matchesStatus(appointment) &&
        matchesDuration(appointment)
    );
  };

  const filteredAppointments = handleFilter();
  const appointmensPerPage = 3;

    const [currrentAppointments, setCurrentAppointments] = useState(filteredAppointments.slice(0, appointmensPerPage));
    useEffect(() => {
      setCurrentAppointments(filteredAppointments.slice(
       (currentPage - 1) * appointmensPerPage,
       currentPage * appointmensPerPage
      )
     );
   } ,[currentPage, filteredAppointments]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / appointmensPerPage);
  

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading appointments...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load appointments.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      {/* Filter and Search Section */}
      <section className="mb-6">
        <input
          type="text"
          placeholder="Search by category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border mr-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border mr-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">All</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
          className="border mr-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">All Durations</option>
          <option value="this_week">Due This Week</option>
          <option value="next_week">Due Next Week</option>
          <option value="this_month">Due This Month</option>
          <option value="next_month">Due Next Month</option>
          <option value="last_month">Due Last Month</option>
        </select>
      </section>

      {/* Latest Appointments Section */}
      <section className="mb-12">
        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500 text-center">No upcoming appointments.</p>
        ) : (
          currrentAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-normal text-gray-800">
                  {appointment.category || appointment.interview_type}
                </h3>
                <span
                  className={`text-xs font-semibold rounded-full px-4 py-1 text-white ${
                    appointment.done ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  {appointment.done ? "Done" : "Pending"}
                </span>
              </div>
              {appointment.interview_type !== "soft_skills_assessment" && appointment.skills_passed.length > 0 && (
                <p className="text-gray-600">
                  Skills Passed: {appointment.skills_passed}
                </p>
              )}
              <p className="text-gray-600">
                Appointment Date:{" "}
                {new Date(appointment.appointment_date).toLocaleString()}
              </p>
              <Link
                to={`/appointment/${appointment.id}`}
                className="text-blue-500 hover:underline mt-4 inline-block"
              >
                View Details
              </Link>
            </div>
          ))
        )}

{filteredAppointments.length > appointmensPerPage && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Back
          </button>
          <span className="font-normal">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Next
          </button>
        </div>
      )}
      </section>
    </div>
  );
};

export default AppointmentsPage;
