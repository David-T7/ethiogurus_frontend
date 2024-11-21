import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const [changeDate, setChangeDate] = useState(false); // For toggling the change date option
  const [newDate, setNewDate] = useState(""); // For holding the new appointment date
  const [interviewer , setInterviewer]  = useState(null) 
  const token = localStorage.getItem("access");
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/appointments/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAppointment(response.data);
      } catch (err) {
        setError(
          err.response
            ? err.response.data.detail
            : "Failed to fetch appointment details"
        );
      }
    };

    fetchAppointment();
  }, [id, token]);


  useEffect(() => {
    const fetchInterviewerData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/interviewer/manage/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInterviewer(response.data);
      } catch (error) {
        console.log("error occured", error);
      }
    };
    fetchInterviewerData();
  }, []);

  const handleDateChange = async () => {
    try {
        const formattedDate = new Date(newDate).toISOString(); // ISO 8601 format
        
        // Logging the data before sending it to the backend
        console.log("Data to be sent:", {
            appointment_id: id.toString(),
            date: formattedDate,
            interviewer_id: interviewer.id.toString(),
        });

        const response = await axios.post(
            "http://127.0.0.1:8000/api/user/select-appointment/",
            {
                appointment_id: id.toString(),
                date: formattedDate,
                interviewer_id: interviewer.id.toString(),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        setAppointment({ ...appointment, appointment_date: newDate });
        setChangeDate(false); // Hide the date input after submission
        alert("Appointment date updated successfully!");

    } catch (error) {
        console.error("Error updating appointment date:", error.response ? error.response.data : error);
        alert("Failed to update the appointment date.");
    }
};

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!appointment) {
    return (
      <div className="text-center py-8">Loading appointment details...</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">
        Appointment Details
      </h1>
      <div className="flex items-center mb-2">
      <h1 className="text-xl font-thin text-brand-dark-blue">
      <span className="font-normal">Type:</span> {appointment.interview_type}
      </h1>
      </div>

      {appointment.interview_type !== "soft_skills_assessment" && <>
      <div className="flex items-center mb-2">
      <h1 className="text-xl font-thin text-brand-dark-blue">
        <span className="font-normal">Skills Passed</span>{appointment.skills_passed}
      </h1>
      </div>
      </>}


      <div className="flex items-center mb-2">
     
      <h1 className="text-xl font-thin text-brand-dark-blue">
      <span className="font-normal">Selected Date</span>: {new Date(appointment.appointment_date).toLocaleString()}
        </h1>
        </div>

      {/* Checkbox for changing the appointment date */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="changeDate"
          checked={changeDate}
          onChange={() => setChangeDate(!changeDate)}
          className="mr-2"
        />
        <label htmlFor="changeDate" className="text-xl font-thin text-brand-dark-blue">
          Change Appointment Date
        </label>
      </div>

      {/* Display datetime input if changeDate is checked */}
      {changeDate && (
<>
        <label htmlFor="newDate" className="text-xl font-thin text-brand-dark-blue mb-2">
            Select New Date and Time
          </label>
          <input
            type="datetime-local"
            id="newDate"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="block border mr-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
          <button
            onClick={() => handleDateChange()}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Appointment Date
          </button>
          </>)}
    </div>
  );
};

export default AppointmentDetails;
