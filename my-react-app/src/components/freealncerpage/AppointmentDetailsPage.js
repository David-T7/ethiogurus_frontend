// AppointmentDetailsPage.js
import React, { useState } from "react";
import { useLocation , useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";
import SelectAppointmentDate from './SelectAppointmentDate'; // Import the new component
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";

const AppointmentDetailsPage = () => {
  const location = useLocation();
  const { appointment } = location.state || {};
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [appointmentDateSelected, setAppointmentDateSelected] = useState(false);
  const [cancelAppointment , setCancelAppointment] = useState(false)
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const navigate = useNavigate()
  if (!appointment) {
    return <p>No appointment details available.</p>;
  }

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleDateChange = (e) => {
    setNewDate(e.target.value);
  };

  const handleSaveNewDate = () => {
    console.log("New date selected:", newDate);
    // Here, you can integrate an API call to update the appointment date
    setModalIsOpen(false);
  };

  const handleConfirmAppointment = () => {
    console.log("Appointment confirmed!");
    // Add logic to confirm the appointment
  };

  const handleCancelAppointment = async () => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/appointments/${appointment.id}/`,
        {
            appointment_date: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Optional, but ensures you're sending JSON
          },
        }
      );
      console.log('Appointment canceled ', response.data);
     // Refresh the page to the same route
     navigate(location.pathname); // This will refresh the current route

    } catch (error) {
      console.error("Error during confirming appointment date:", error);
      // You may want to show an error message to the user here
    }
};
    
  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-normal text-brand-blue mb-4">
          Interview for {appointment.category}
        </h1>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-brand-blue text-xl" />
            <p className="text-md">
              <span className="text-brand-blue">Date:</span>{" "}
              {new Date(appointment.appointment_date).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-brand-blue text-xl" />
            <p className="text-md">
              <span className="text-brand-blue">Location:</span> {appointment.location || "Online"}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <FaInfoCircle className="text-brand-blue text-xl" />
            <p className="text-md">
              <span className="text-brand-blue">Status:</span> {appointment.status || "Pending"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-dark-green transition"
          >
            Change Appointment Date
          </button>
          <button
            onClick={handleCancelAppointment}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancel Appointment
          </button>
        </div>
      </div>

     {/* Modal for changing the appointment date */}
     {modalIsOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <SelectAppointmentDate
            appointmentOptions={appointment.appointment_date_options} // Provide available slots
            appointmentID={appointment.id}
            setAppointmentDateSelected={setAppointmentDateSelected}
            onClose={handleCloseModal}
          />
        </div>
      )}
    </div>
  );
};

export default AppointmentDetailsPage;
