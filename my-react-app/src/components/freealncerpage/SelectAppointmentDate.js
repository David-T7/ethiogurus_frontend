import React, { useState } from 'react';
import axios from "axios";

const SelectAppointmentDate = ({ appointmentOptions, appointmentID, setAppointmentDateSelected=false,onClose }) => {
  const [selectedOption, setSelectedOption] = useState(null); // Store both date and interviewer_id
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDateSelection = (option) => {
    setSelectedOption(option); // Set selected option with both date and interviewer_id
    setShowConfirmation(true); // Show confirmation popup
  };

  const handleConfirm = async () => {
    // This is where you will send the selected date, interviewer_id, and appointmentID to the backend
    console.log("selected date is",selectedOption)
    console.log('Confirmed appointment:', {
      appointmentID,
      date: selectedOption.date,
      interviewer_id: selectedOption.interviewer_id
    });

    const token = localStorage.getItem("access");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/select-appointment/",
        {
          appointment_id: appointmentID,
          date: selectedOption.date,
          interviewer_id: selectedOption.interviewer_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Optional, but ensures you're sending JSON
          },
        }
      );
      console.log('Appointment confirmed:', response.data);
      setAppointmentDateSelected(true)
      onClose(); // Close the modal after confirmation

    } catch (error) {
      console.error("Error during confirming appointment date:", error);
      // You may want to show an error message to the user here
    }
};
  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedOption(null); // Reset selected option
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-lg font-semibold mb-2">Select an Interview Date</h2>
      <p className="text-gray-600 mb-4">Please choose a date from the following options:</p>
      <ul>
        {appointmentOptions.length === 0 ? (
          <li className="text-gray-600 text-center">No appointment dates available.</li>
        ) : (
          appointmentOptions.map((option, index) => (
            <li key={index} className="flex justify-between items-center p-2 border-b">
              <span>{new Date(option.date).toLocaleString()}</span>
              <button
                onClick={() => handleDateSelection(option)}
                className={`bg-blue-500 text-white text-center py-1 px-2 rounded hover:bg-blue-600 transition 
                            ${selectedOption && selectedOption.date === option.date ? 'bg-blue-700' : ''} w-[50%] text-left`}
              >
                {selectedOption && selectedOption.date === option.date ? 'Selected' : 'Select'}
              </button>
            </li>
          ))
        )}
      </ul>

      {showConfirmation && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <h3 className="font-semibold">Are you sure you want to select this date?</h3>
          <p>You have selected: {new Date(selectedOption.date).toLocaleString()}</p>
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
