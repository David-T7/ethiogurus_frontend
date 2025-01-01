import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";
const fetchAppointment = async ({ queryKey }) => {
  const [, { id, token }] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8000/api/appointments/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const fetchInterviewer = async ({ queryKey }) => {
  const [, { token }] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/user/interviewer/manage/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateAppointmentDate = async ({ id, formattedDate, interviewerId, token }) => {
  const response = await axios.patch(
    "http://127.0.0.1:8000/api/user/select-appointment/",
    {
      appointment_id: id.toString(),
      date: formattedDate,
      interviewer_id: interviewerId.toString(),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const AppointmentDetails = () => {
  const { id } = useParams();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

  const queryClient = useQueryClient();

  const [changeDate, setChangeDate] = useState(false);
  const [newDate, setNewDate] = useState("");

  // Fetch appointment details
  const {
    data: appointment,
    isLoading: appointmentLoading,
    error: appointmentError,
  } = useQuery({
    queryKey: ["appointment", { id, token }],
    queryFn: fetchAppointment,
  });

  // Fetch interviewer details
  const {
    data: interviewer,
    isLoading: interviewerLoading,
    error: interviewerError,
  } = useQuery({
    queryKey: ["interviewer", { token }],
    queryFn: fetchInterviewer,
  });

  // Mutation for updating appointment date
  const mutation = useMutation({
    mutationFn: ({ id, formattedDate, interviewerId, token }) =>
      updateAppointmentDate({ id, formattedDate, interviewerId, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointment", { id, token }]);
      alert("Appointment date updated successfully!");
      setChangeDate(false);
    },
    onError: () => {
      alert("Failed to update the appointment date.");
    },
  });

  const handleDateChange = () => {
    const formattedDate = new Date(newDate).toISOString();
    mutation.mutate({ id, formattedDate, interviewerId: interviewer.id, token });
  };

  if (appointmentLoading || interviewerLoading) {
    return <div className="text-center py-8">Loading appointment details...</div>;
  }

  if (appointmentError || interviewerError) {
    return (
      <div className="text-center py-8 text-red-500">
        {appointmentError?.message || interviewerError?.message || "An error occurred."}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-8">
      <h1 className="text-3xl font-thin text-brand-dark-blue mb-6">Appointment Details</h1>
      <div className="flex items-center mb-2">
        <h1 className="text-xl font-thin text-brand-dark-blue">
          <span className="font-normal">Type:</span> <span className="text-black">{appointment.interview_type}</span>
        </h1>
      </div>

      {appointment.interview_type !== "soft_skills_assessment" && appointment.skills_passed.lenght > 0 && (
        <div className="flex items-center mb-2">
          <h1 className="text-xl font-thin text-brand-dark-blue">
            <span className="font-normal">Skills Passed:</span> <span className="text-black">{appointment.skills_passed}</span>
          </h1>
        </div>
      )}

      <div className="flex items-center mb-2">
        <h1 className="text-xl font-thin text-brand-dark-blue">
          <span className="font-normal">Selected Date:</span>{" "}
          <span className="text-black">{new Date(appointment.appointment_date).toLocaleString()}</span>
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
            onClick={handleDateChange}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Appointment Date
          </button>
        </>
      )}
    </div>
  );
};

export default AppointmentDetails;
