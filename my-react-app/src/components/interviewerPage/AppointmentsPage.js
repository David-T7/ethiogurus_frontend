import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const token = localStorage.getItem("access");
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 interviews

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/appointments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointments(response.data);
      } catch (err) {
        setError(
          err.response
            ? err.response.data.detail
            : "Failed to fetch appointments"
        );
      }
    };

    fetchAppointments();
  }, []);

  // Function to handle filtering appointments
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

    const nextMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    ); // Start of next month
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0); // End of next month

    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    ); // Start of last month
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0); // End of last month

    const matchesSearch = (appointment) =>
      appointment.category.toLowerCase().includes(searchTerm.toLowerCase());

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
            appointmentDate >= lastMonthStart && appointmentDate <= lastMonthEnd
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

  // Function to handle "See More" and "See Less" functionality
  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Increase visible count by 5
  };

  const handleSeeLess = () => {
    setVisibleCount(5); // Reset to show only the first 5
  };

  const filteredAppointments = handleFilter();

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
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
          filteredAppointments.slice(0, visibleCount).map((appointment) => (
            <div
              key={appointment.id}
              className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-normal text-gray-800">
                  {appointment.category}
                </h3>
                <span
                  className={`text-xs font-semibold rounded-full px-4 py-1 text-white ${
                    appointment.done ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  {appointment.done ? "Done" : "Pending"}
                </span>
              </div>
              <p className="text-gray-600">
                Skills Passed: {appointment.skills_passed}
              </p>
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

        {filteredAppointments.length > visibleCount && (
          <button
            onClick={handleSeeMore}
            className="bg-blue-500 text-white px-4 py-2 rounded"
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

export default AppointmentsPage;
