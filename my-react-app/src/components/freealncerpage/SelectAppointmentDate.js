import React, { useEffect, useState } from 'react';
import axios from "axios";
import { decryptToken } from '../../utils/decryptToken';
const SelectAppointmentDate = ({ appointmentOptions, appointmentID, setAppointmentDateSelected=false,onClose ,newAppointment}) => {
  const [selectedOption, setSelectedOption] = useState(null); // Store both date and interviewer_id
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDateSelection = (option) => {
    setSelectedOption(option); // Set selected option with both date and interviewer_id
    setShowConfirmation(true); // Show confirmation popup
  };
  useEffect( () => {
    console.log("appointment id is",appointmentID)
    console.log("appointment date options ",appointmentOptions)
  }
    ,[]
  )

  const handleConfirm = async () => {
    // Ensure date is in the correct ISO format
    const formattedDate = new Date(selectedOption.date).toISOString();
    console.log("Selected date is:", selectedOption);
    console.log('Confirmed appointment:', {
      appointmentID,
      date: formattedDate,
      interviewer_id: selectedOption.interviewer_id,
    });
  
    // Get and decrypt the token
    const encryptedToken = localStorage.getItem('access');
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const token = decryptToken(encryptedToken, secretKey); 
  
    try {
      let response;
      
      const appointmentData = {
        appointment_id: appointmentID,
        date: formattedDate,
        interviewer_id: selectedOption.interviewer_id,
      };
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      if (newAppointment) {
        // POST request to create a new appointment
        response = await axios.post(
          "http://127.0.0.1:8000/api/user/select-appointment/",
          appointmentData,
          config
        );
      } else {
        // PATCH request to update an existing appointment
        response = await axios.patch(
          "http://127.0.0.1:8000/api/user/select-appointment/",
          appointmentData,
          config
        );
      }
  
      console.log('Appointment confirmed:', response.data);
  
      // Set state and close modal after confirmation
      setAppointmentDateSelected(true);
      onClose();
  
    } catch (error) {
      // Enhanced error logging
      console.error("Error during confirming appointment date:", error.response || error.message || error);
      // Handle error feedback to user
      alert("There was an error confirming your appointment. Please try again.");
    }
  };
  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedOption(null); // Reset selected option
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
    <h2 className="text-lg font-normal text-brand-dark-blue mb-2">Select an Interview Date</h2>
    <p className="text-gray-600 mb-4">Please choose a date from the following options:</p>
    <ul>
      {appointmentOptions.length === 0 ? (
        <li className="text-gray-600 text-center">No appointment dates available.</li>
      ) : (
        appointmentOptions.map((option, index) => {
          // Format the date with month, day, year, and time in 12-hour format with AM/PM
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'long', // Full month name (e.g., October)
            day: 'numeric', // Numeric day of the month
            year: 'numeric', // Full year (e.g., 2024)
            hour: 'numeric', // Hour in 12-hour format
            minute: '2-digit', // Minute with leading zero if needed
            hour12: true, // 12-hour clock with AM/PM
          }).format(new Date(option.date));
  
          return (
            <li key={index} className="flex justify-between items-center p-2 border-b">
              <span>{formattedDate}</span>
              <button
                onClick={() => handleDateSelection(option)}
                className={`bg-blue-500 text-white text-center py-1 px-2 rounded hover:bg-blue-600 transition 
                            ${selectedOption && selectedOption.date === option.date ? 'bg-blue-700' : ''} w-[50%] text-left`}
              >
                {selectedOption && selectedOption.date === option.date ? 'Selected' : 'Select'}
              </button>
            </li>
          );
        })
      )}
    </ul>

    {showConfirmation && (
  <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
    <h3 className="font-semibold">Are you sure you want to select this date?</h3>
    <p>
      You have selected:{" "}
      {new Date(selectedOption.date).toLocaleString("en-US", {
        weekday: "long", // e.g., Monday
        month: "long", // e.g., October
        day: "numeric", // e.g., 24
        year: "numeric", // e.g., 2024
        hour: "numeric", // e.g., 10
        minute: "2-digit", // e.g., 04
        hour12: true, // 12-hour format
      })}
    </p>
    <div className="mt-2 flex justify-between">
      <button
        onClick={handleConfirm}
        className="bg-green-500 text-white py-1 px-3 w-[25%] rounded hover:bg-green-600"
      >
        Yes
      </button>
      <button
        onClick={handleCancel}
        className="bg-red-500 text-white py-1 px-3 w-[25%] rounded hover:bg-red-600 mr-20"
      >
        No
      </button>
    </div>
  </div>
)}

      <button
        onClick={onClose}
        className="mt-4 text-gray-600 underline"
      >
        Close
      </button>
    </div>
  );
};

export default SelectAppointmentDate;
