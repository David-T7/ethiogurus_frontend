import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Ensure react-router-dom is installed and configured
import { FaCheckCircle } from 'react-icons/fa'; // Optional: If you want to use icons
import { decryptToken } from '../../utils/decryptToken';
const fetchDashboardData = async ({ queryKey }) => {
  const [, token] = queryKey;
  const response = await axios.get('http://127.0.0.1:8000/api/interviewer/dashboard/', {
    headers: {
      Authorization: `Bearer ${token}`, // Adjust as needed
    },
  });
  return response.data;
};

const InterviewerDashboard = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardData', token],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">{error.response?.data?.detail || 'Failed to fetch dashboard data'}</div>;
  }

  const { latest_appointments: appointments, latest_interviews: interviews } = data;

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">      
      {/* Latest Appointments Section */}
      <section className="mb-12">
        <h2 className="text-lg font-normal text-center text-brand-dark-blue mb-6">Latest Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center">No upcoming appointments.</p>
          ) : (
            appointments.map(appointment => (
              <div key={appointment.id} className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-normal text-gray-800">{appointment.category ? appointment.category : appointment.interview_type}</h3>
                  <span className={`text-xs font-semibold rounded-full px-4 py-1 text-white ${appointment.done ? "bg-green-500" : "bg-blue-500"}`}>
                    {appointment.done ? "done" : "pending"}
                  </span>
              </div>
                  {appointment.interview_type !== "soft_skills_assessment" && appointment.skills_passed.length > 0 && (
                    <p className="text-gray-600">Skills Passed: {appointment.skills_passed}</p>
                  )}
                  <p className="text-gray-600">Appointment Date: {new Date(appointment.appointment_date).toLocaleString()}</p>
                  <p className="text-gray-600">Type: {appointment.interview_type}</p>

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
