import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { decryptToken } from '../../utils/decryptToken';

const fetchResumesAndScreeningResults = async (token) => {
  const response = await axios.get('http://127.0.0.1:8000/api/not-started-assessments/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// const fetchFreelancerDetails = async (freelancerId, token) => {
//   const response = await axios.get(`http://127.0.0.1:8000/api/user/freelancer/${freelancerId}/`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

const ResumeCheckDashboard = () => {
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notStartedAssessments', { token }],
    queryFn: () => fetchResumesAndScreeningResults(token),
    enabled: !!token, // Ensure the query runs only if the token exists
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading resumes and screening results...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">{error.message}</div>;
  }

  const { resumes = [], screening_results = [], full_assesments = [] } = data;

  // Updated handleViewDetails function
const handleViewDetails = async (resume, screeningResult) => {
      navigate(`/resume/${resume.id}`, {
        state: {
          resume,
          screeningResult,
        },
      });
};

  return (
    <div className="max-w-md mx-auto p-8 mt-8">
      <section className="mb-12">
        <h2 className="text-lg font-normal text-center text-brand-dark-blue mb-6">
          Resumes and Screening Results
        </h2>
        {resumes.length === 0 && screening_results.length === 0 ? (
          <p className="text-gray-500 text-center">No resumes or screening results available.</p>
        ) : (
          resumes.map((resume) => {
            const screeningResult = screening_results.find(
              (result) => result.resume.id === resume.id
            );

            return (
              <div
                key={resume.id}
                className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm"
              >
                {/* Name and Email */}
                <h3 className="text-xl font-normal text-gray-800">{resume.full_name}</h3>
                <p className="text-gray-600">Email: {resume.email}</p>

                {/* Screening Score */}
                {screeningResult ? (
                  <div className="mt-2">
                    <p className="text-gray-600">Score: {screeningResult.score}</p>
                    <p
                      className={`text-gray-600 ${
                        screeningResult.passed ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      Status: {screeningResult.passed ? 'Passed' : 'Failed'}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 mt-2">No screening result available.</p>
                )}

                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(resume, screeningResult)}
                  className="text-blue-600 underline hover:text-blue-800 transition duration-200 mt-4"
                >
                  View Details
                </button>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default ResumeCheckDashboard;
