import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { decryptToken } from '../../utils/decryptToken';

const fetchServiceById = async (serviceId, token) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/services/${serviceId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchTechnologies = async (token) => {
  const response = await axios.get('http://127.0.0.1:8000/api/technologies/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Choices for status fields
const choiceFieldOptions = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'pending', label: 'Pending' },
  { value: 'passed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
  { value: 'on_hold', label: 'On Hold' },
];


const ResumeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resume, screeningResult, freelancer_id} = location.state || {};
  const [services, setServices] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showMore, setShowMore] = useState(false); // State to toggle feedback view
  const encryptedToken = localStorage.getItem('access');
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const token = decryptToken(encryptedToken, secretKey);
  const [assesmentSkillAdd , setAssesmentSkillAdd]= useState(false)
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0); // Tracks the current applied position
  const [modalData, setModalData] = useState(
    resume?.applied_positions.reduce(
      (acc, positionId) => ({
        ...acc,
        [positionId]: {
          soft_skills_assessment_status: 'not_started',
          depth_skill_assessment_status: 'not_started',
          live_assessment_status: 'not_started',
        },
      }),
      {}
    )
  );

  console.log("modal data is ",modalData)
  console.log("selected technologies is ",selectedTechnologies)
  const handleNextPosition = () => {
    if (currentPositionIndex < resume.applied_positions.length - 1) {
      setCurrentPositionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousPosition = () => {
    if (currentPositionIndex > 0) {
      setCurrentPositionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleModalFieldChange = (field, value) => {
    const positionId = resume.applied_positions[currentPositionIndex];
    setModalData((prev) => ({
      ...prev,
      [positionId]: {
        ...prev[positionId],
        [field]: value,
      },
    }));
  };

  const currentPositionId = resume.applied_positions[currentPositionIndex];
  const currentPositionData = modalData[currentPositionId];
  useEffect(() => {
    const fetchServices = async () => {
      if (resume && resume.applied_positions) {
        try {
          const servicePromises = resume.applied_positions.map((positionId) =>
            fetchServiceById(positionId, token)
          );
          const serviceResults = await Promise.all(servicePromises);
          setServices(serviceResults);
        } catch (error) {
          console.error('Error fetching services:', error);
          setIsError(true);
        }
      }
    };

    const fetchAllTechnologies = async () => {
      try {
        const techData = await fetchTechnologies(token);
        setTechnologies(techData);
      } catch (error) {
        console.error('Error fetching technologies:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
    fetchAllTechnologies();
  }, [resume, token]);

  const handleSelectTechnology = (positionId, techIds) => {
    setSelectedTechnologies((prev) => ({
      ...prev,
      [positionId]: techIds,
    }));
  };

  // Helper function to approve freelancer
const approveFreelancer = async (freelancerId, token) => {
    setIsModalOpen(true);
  };

  const handleSubmitActivation = async (freelancerId, token) => {
    try {
      // Example patch request to update project status and assessments
      await axios.patch(
        `http://127.0.0.1:8000/api/activate-full-assessment/${freelancerId}/`,
        {
          modalData:modalData,
          selectedTechnologies:selectedTechnologies
        }
        ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.patch(
        `http://127.0.0.1:8000/api/assign-soft-skills-assessment-appointment/${freelancerId}/`,
        {
          modalData
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      alert('Project activated successfully.');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error activating project:', error);
      alert('Failed to activate project.');
    }
  };


  


  // Helper function to activate soft skills assessment
const activateSoftSkillsAssessment = async (freelancerId, token) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/activate-full-assessment/${freelancerId}/`,
        {

        }
        ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.patch(
        `http://127.0.0.1:8000/api/assign-soft-skills-assessment-appointment/${freelancerId}/`,
        {

        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Soft Skills Assessment Activated');
    } catch (error) {
      console.error('Error activating soft skills assessment:', error);
      alert('Failed to activate soft skills assessment.');
    }
  };

  const handleAddFreelancer = async (freelancerId) => {
    try {
      // Example patch request to update project status and assessments
      await axios.patch(
        `http://127.0.0.1:8000/api/approve_freelancer/${freelancerId}/`,
        {
          modalData :modalData,
          selectedTechnologies:selectedTechnologies
        }
        ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsModalOpen(false);
} catch (error) {
  console.error('Error approving freelancer:', error);
  alert('Failed to approve freelancer.');
}
}

  if (isLoading) {
    return <div className="text-center py-8">Loading resume details...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">Error fetching services.</div>;
  }

  if (!resume) {
    return <div className="text-center py-8 text-red-500">No resume data provided.</div>;
  }

  const { full_name, email, applied_positions = [], resume_file, freelancer } = resume;
  const resumeFileUrl = resume_file && resume_file.startsWith('http') ? resume_file : `http://127.0.0.1:8000${resume_file}`;

  return (
    <div className="max-w-lg mx-auto p-8 mt-8">
      <h1 className="text-lg font-normal text-center text-brand-dark-blue mb-6">Resume Details</h1>

      <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
        {/* Displaying basic resume info */}
        <h2 className="text-xl font-normal text-gray-800 mb-2">{full_name}</h2>
        <p className="text-gray-600">Email: {email}</p>

        {/* Applied Positions */}
        <h3 className="text-xl font-normal text-gray-800 mt-4">Applied Positions</h3>
        {applied_positions.length > 0 ? (
          <ul className="list-disc pl-5">
            {applied_positions.map((positionId, index) => (
              <li key={index} className="text-gray-600">
                {services[index] ? services[index].name : `Position ID: ${positionId}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No applied positions available.</p>
        )}

        {/* Screening Results */}
        <h3 className="text-xl font-normal text-gray-800 mt-4">Screening Results</h3>
        {screeningResult ? (
          <div>
            <p className="text-gray-600">Score: {screeningResult.score}</p>
            <p
              className={`text-gray-600 ${
                screeningResult.passed ? 'text-green-500' : 'text-red-500'
              }`}
            >
              Status: {screeningResult.passed ? 'Passed' : 'Failed'}
            </p>

            {/* Displaying feedback with show more functionality */}
            <div className="mt-2">
              <p className="text-gray-600">
                <span>
                  {showMore
                    ? screeningResult.comments
                    : `${screeningResult.comments.substring(0, 200)}...`}
                </span>
                {screeningResult.comments.length > 200 && (
                  <button
                    onClick={() => setShowMore((prev) => !prev)}
                    className="text-blue-600 underline hover:text-blue-800 transition duration-200 ml-2"
                  >
                    {showMore ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No screening result available.</p>
        )}

        {/* Resume File Link */}
        {resumeFileUrl && (
          <div className="mt-4">
            <p className="text-gray-600">Resume File:</p>
            <a
              href={resumeFileUrl} // Ensure full URL is used
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 transition duration-200"
            >
              Open Resume (PDF)
            </a>
          </div>
        )}
           {/* Buttons for actions */}
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setIsActivationModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Activate Assessment
          </button>
          <button
            onClick={() => approveFreelancer(freelancer_id, token)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Approve Freelancer
          </button>
        </div>

        {/* Modal for selecting technologies */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-normal text-center text-gray-800 mb-4">Select Skills to Add</h2>
              {applied_positions.map((positionId) => {
                const service = services.find((service) => service.id === positionId);
                return (
                  service && (
                    <div key={positionId} className="mb-4">
                      <h3 className="text-lg">{service.name}</h3>
                      <select
                        multiple
                        value={selectedTechnologies[positionId] || []}
                        onChange={(e) =>
                          handleSelectTechnology(positionId, Array.from(e.target.selectedOptions, (option) => option.value))
                        }
                        className="w-full border border-gray-300 rounded-lg p-2"
                      >
                        <option value="">Select Technologies</option>
                        {service.technologies.map((tech) => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                );
              })}
              <div className="flex justify-between">
                
                <button
                 onClick={() => { if(assesmentSkillAdd) { setIsActivationModalOpen(true) ; setIsModalOpen(false); setAssesmentSkillAdd(false);} else{ handleAddFreelancer(freelancer_id)}}}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  {assesmentSkillAdd ? "Add Skill":"Add Freelancer"}
                </button>
                <button
                  onClick={() => { if(assesmentSkillAdd){ setIsActivationModalOpen(true) ; setIsModalOpen(false) ; setAssesmentSkillAdd(false) ; setSelectedTechnologies({})} else {setIsModalOpen(false)}}}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}



        
{isActivationModalOpen && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
      <h3 className="text-xl font-normal mb-4">Activate Assessments</h3>
      <button
              className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => { setIsModalOpen(true) ; setAssesmentSkillAdd(true) ; setIsActivationModalOpen(false)  }}
            >
              Add Skill
            </button>
      <div className='mb-2'>
              <p className='text-lg font-normal'>
                Position: {services[currentPositionIndex]?.name || `Position ID: ${currentPositionId}`}
              </p>
              <div>
                <label className="block">Soft Skills Assessment Status:</label>
                <select
                  value={currentPositionData.soft_skills_assessment_status}
                  onChange={(e) =>
                    handleModalFieldChange('soft_skills_assessment_status', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded"
                >
                  {choiceFieldOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block">Depth Skill Assessment Status:</label>
                <select
                  value={currentPositionData.depth_skill_assessment_status}
                  onChange={(e) =>
                    handleModalFieldChange('depth_skill_assessment_status', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded"

                >
                  {choiceFieldOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block">Live Assessment Status:</label>
                <select
                  value={currentPositionData.live_assessment_status}
                  onChange={(e) =>
                    handleModalFieldChange('live_assessment_status', e.target.value)
                  }
                  className="block w-full px-3 py-2 border border-gray-300 rounded"
z
                >
                  {choiceFieldOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
      {/* Modal Actions */}
      <div className="flex justify-end mt-6">
              <button onClick={handlePreviousPosition} disabled={currentPositionIndex === 0}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"

              >
                Back
              </button>
              <button
                onClick={handleNextPosition}
                disabled={currentPositionIndex === resume.applied_positions.length - 1}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
              >
                Next
              </button>
              <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
              onClick={() => handleSubmitActivation(freelancer_id, token)}>
                Submit
              </button>
              <button 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
              onClick={() => {setIsModalOpen(false) ; setIsActivationModalOpen(false) }}>Close</button>
            </div>

            
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ResumeDetails;
