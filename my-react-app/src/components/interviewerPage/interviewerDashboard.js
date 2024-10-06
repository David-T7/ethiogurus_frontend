import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Ensure react-router-dom is installed and configured
import { FaCheckCircle } from 'react-icons/fa'; // Optional: If you want to use icons

const InterviewerDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/interviewer/dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`, // Adjust as needed
          },
        });
        setAppointments(response.data.latest_appointments);
        setInterviews(response.data.latest_interviews);
      } catch (err) {
        setError(err.response ? err.response.data.detail : 'Failed to fetch dashboard data');
      }
    };

    fetchDashboardData();
  }, [token]);

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin mb-8 text-brand-dark-blue text-center">Welcome Back!</h1>
      
      {/* Latest Appointments Section */}
      <section className="mb-12">
        <h2 className="text-md font-normal text-brand-dark-blue mb-6">Have a look at the latest Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center">No upcoming appointments.</p>
          ) : (
            appointments.map(appointment => (
              <div key={appointment.id} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-normal text-gray-800">{appointment.category}</h3>
                  <span className={`text-xs font-semibold rounded-full px-4 py-1 text-white  ${appointment.done ? "bg-green-500":"bg-blue-500"}`}>
              {appointment.done ? "done" : "pending"}
            </span>
            </div>
                  <p className="text-gray-600">Skills Passed: {appointment.skills_passed}</p>
                  <p className="text-gray-600">Appointment Date: {new Date(appointment.appointment_date).toLocaleString()}</p>
              
                  <Link 
                    to={`/appointment/${appointment.id}`} 
                   className="text-blue-500 hover:underline mt-4 inline-block"
                  >
                    View Details
                  </Link>
                  </div>
            ))
          )}
      </section>      
    </div>
  );
};

export default InterviewerDashboard;
