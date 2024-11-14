import React, { useState, useEffect } from 'react';
import { FaLock, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { useParams , useLocation } from 'react-router-dom';
import axios from 'axios';
import SelectAppointmentDate from '../freealncerpage/SelectAppointmentDate';
const AssessmentRoadmap = () => {
  const { id } = useParams(); // Get interview ID from URL
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null); // Track the selected step for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [appointments, setAppointments] = useState([]);
  const [appointmentDateSelected, setAppointmentDateSelected] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const location = useLocation();
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(`http://127.0.0.1:8000/api/assessments/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("assesment data is ",response.data)
        setAssessment(response.data);
      } catch (error) {
        console.error('Failed to fetch assessment:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [selectedAppointment]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/api/appointments/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        setError(error);
      }
    };
    fetchAppointments();
  }, []);

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const isValidAppointmentDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  if (loading) return <div className="text-center py-8">Loading assessment progress...</div>;
  if (error) return <div className="text-center py-8">Failed to load assessment. Please try again later.</div>;
  if (!assessment) return <div className="text-center py-8">No assessment data found.</div>;

  const roadmapSteps = [
    { key: 'soft_skills_assessment', label: 'Soft Skills Assessment', description: 'Understand your soft skills for various roles.' },
    { key: 'depth_skill_assessment', label: 'Depth Skill Assessment', description: 'Evaluate your in-depth knowledge and expertise in relevant skills.' },
    { key: 'live_assessment', label: 'Live Assessment', description: 'Assess your live problem-solving and coding skills.' },
  ];

  const openModal = (step) => {
    setSelectedStep(step);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStep(null);
    setIsModalOpen(false);
  };

  const getAppointmentForStep = (stepKey) => {
    return appointments.find((appointment) => appointment.interview_type === stepKey && !appointment.done);
  };

  const handleSelectDate = (appointment) => {
    // Parse the JSON string for appointment_date_options if it exists
    const parsedOptions = appointment.appointment_date_options
      ? JSON.parse(appointment.appointment_date_options)
      : [];
    setSelectedAppointment({ ...appointment, appointment_date_options: parsedOptions });
    setModalIsOpen(true); // Open modal after setting selected appointment
  };


  return (
    <div className="max-w-3xl mx-auto p-8 mt-8">
      <h1 className="text-center text-3xl font-thin text-brand-dark-blue mb-6">Assessment Progress</h1>

      <div className="flex flex-col items-center space-y-6">
        {roadmapSteps.map((step) => {
          const appointment = getAppointmentForStep(step.key);
    
          return (
            <div key={step.key} className="flex flex-col items-center">
              {/* Step Icon */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                assessment[step.key] ? 'bg-green-500' : appointment ? 'bg-yellow-500' : 'bg-gray-300'
              }`}>
                {assessment[step.key] ? (
                  <FaCheckCircle className="text-white" />
                ) : appointment ? (
                  <FaHourglassHalf className="text-white" />
                ) : (
                  <FaLock className="text-white" />
                )}
              </div>

              {/* Step Label and Status */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-brand-dark-blue">{step.label}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {assessment[step.key] ? 'Completed' : appointment ? appointment.appointment_date 
                  ?'Pending Interview':
            
                  <div className="flex justify-center mt-2">
                  <button 
                    className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    onClick={() => handleSelectDate(appointment)}
                  >
                    <span className="text-sm">Select Interview Date</span>
                  </button>
                </div>
                  : 'Not Started'}
                </p>

                {appointment && appointment.appointment_date && (
                  
                  <button
                    onClick={() => openModal(appointment)}
                    className="mt-2 text-sm text-blue-500 underline"
                  >
                    Interview Details
                  </button>
                )}
            
            

                {/* Step Description and More Details Button */}
                <p className="text-sm text-gray-500 italic mt-2">{step.description}</p>
                <button 
                  onClick={() => openModal(step)}
                  className="mt-2 text-sm text-blue-500 underline"
                >
                  More Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall assessment status */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-normal text-brand-dark-blue">Overall Status:</h3>
        <span className={`text-lg font-semibold ${assessment.finished ? 'text-green-500' : 'text-yellow-500'}`}>
          {assessment.finished ? 'Assessment Completed' : 'Assessment In Progress'}
        </span>
      </div>

      {/* Modal */}
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
