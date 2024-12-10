import React, { useState } from "react";
import { FaLock, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SelectAppointmentDate from "../freealncerpage/SelectAppointmentDate";
import { decryptToken } from "../../utils/decryptToken";
const fetchAssessment = async (id, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/assessments/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchAppointments = async (token) => {
  const response = await axios.get("http://127.0.0.1:8000/api/appointments/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const AssessmentRoadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

  const [selectedStep, setSelectedStep] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentDateSelected, setAppointmentDateSelected] = useState(false);

  const { data: assessment, isLoading: isLoadingAssessment, error: assessmentError } = useQuery({
    queryKey: ["assessment", id],
    queryFn: () => fetchAssessment(id, token),
    enabled: !!id,
  });

  const { data: appointments = [], isLoading: isLoadingAppointments, error: appointmentsError } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetchAppointments(token),
    enabled: !!token,
  });

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const isValidAppointmentDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const openModal = (step) => {
    setSelectedStep(step);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStep(null);
    setIsModalOpen(false);
  };

  const getAppointmentForStep = (stepKey) => {
    const trimmedStepKey = stepKey.replace("_status", "");
    return appointments.find((appointment) => appointment.interview_type === trimmedStepKey && !appointment.done);
  };

  const handleSelectDate = (appointment) => {
    const parsedOptions = appointment.appointment_date_options
      ? JSON.parse(appointment.appointment_date_options)
      : [];
    setSelectedAppointment({ ...appointment, appointment_date_options: parsedOptions });
    setModalIsOpen(true);
  };

  const handleStartSkillTest = (assessmentType) => {
    if (assessmentType === "depth_skill_assessment_status") {
      navigate("/depth-skill-test", {
        state: {
          assessment,
        },
      });
    } else if (assessmentType === "soft_skills_assessment_status") {
      navigate("/soft-skill-test", {
        state: {
          assessment,
        },
      });
    }
  };

  if (isLoadingAssessment || isLoadingAppointments) {
    return <div className="text-center py-8">Loading assessment progress...</div>;
  }

  if (assessmentError || appointmentsError) {
    return <div className="text-center py-8">Failed to load data. Please try again later.</div>;
  }

  const roadmapSteps = [
    { key: "soft_skills_assessment_status", label: "Soft Skills Assessment", description: "Understand your soft skills for various roles." },
    { key: "depth_skill_assessment_status", label: "Depth Skill Assessment", description: "Evaluate your in-depth knowledge and expertise in relevant skills." },
    { key: "live_assessment_status", label: "Live Interview Assessment", description: "Live Interview for assessing your skill in applied postiton." },

  ];

  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-center text-3xl font-thin text-brand-dark-blue mb-6">Assessment Progress</h1>

      <div className="flex flex-col items-center space-y-6">
        {roadmapSteps.map((step) => {
          const appointment = getAppointmentForStep(step.key);

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                  assessment[step.key] === "passed"
                    ? "bg-green-500"
                    : appointment || assessment[step.key] === "pending"
                    ? "bg-yellow-500"
                    : "bg-gray-300"
                }`}
              >
                {assessment[step.key] === "passed" ? (
                  <FaCheckCircle className="text-white" />
                ) : appointment || assessment[step.key] === "pending" ? (
                  <FaHourglassHalf className="text-white" />
                ) : (
                  <FaLock className="text-white" />
                )}
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold text-brand-dark-blue">{step.label}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {assessment[step.key] === "passed"
                    ? "Completed"
                    : appointment
                    ? appointment.appointment_date
                      ? "Pending Interview"
                      : (
                        <div className="flex justify-center mt-2">
                          <button
                            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                            onClick={() => handleSelectDate(appointment)}
                          >
                            <span className="text-sm">Select Interview Date</span>
                          </button>
                        </div>
                      )
                    : assessment[step.key] === "pending"
                    ? "Pending"
                    : "Not Started"}
                </p>

                {assessment[step.key] === "pending" && step.key==="depth_skill_assessment_status" && (
                  <div className="flex justify-center mt-2">
                    <button
                      className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                      onClick={() => handleStartSkillTest(step.key)}
                    >
                      <span className="text-sm">
                        Start Depth Skill Test
                      </span>
                    </button>
                  </div>
                )}

                {appointment && appointment.appointment_date && (
                  <button onClick={() => openModal(appointment)} className="mt-2 text-sm text-blue-500 underline">
                    Interview Details
                  </button>
                )}

                <p className="text-sm text-gray-500 italic mt-2">{step.description}</p>
                <button onClick={() => openModal(step)} className="mt-2 text-sm text-blue-500 underline">
                  More Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedStep && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <h3 className="text-xl font-semibold text-brand-dark-blue mb-4">{selectedStep.label || "Interview Details"}</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedStep.description || "Interview details are displayed here."}</p>
            {selectedStep.appointment_date && (
              <p className="text-gray-500 text-sm mb-4">
                Appointment Date: {new Date(selectedStep.appointment_date).toLocaleString()}
              </p>
            )}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &#10005;
            </button>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {modalIsOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <SelectAppointmentDate
            appointmentOptions={selectedAppointment?.appointment_date_options || []}
            appointmentID={selectedAppointment?.id}
            onClose={handleCloseModal}
            setAppointmentDateSelected={setAppointmentDateSelected}
          />
        </div>
      )}
    </div>
  );
};

export default AssessmentRoadmap;
