import React, { useState } from 'react';
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

const fetchFreelancerDetails = async (freelancerId, token) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/user/freelancer/${freelancerId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

const Resumes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const encryptedToken = localStorage.getItem('access');
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const token = decryptToken(encryptedToken, secretKey);
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notStartedAssessments', { token }],
    queryFn: () => fetchResumesAndScreeningResults(token),
    enabled: !!token,
  });

  if (!token) {
    return <div className="text-center py-8 text-red-500">Please log in to view resumes.</div>;
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading resumes and screening results...</div>;
  }

  if (isError) {
    return <div className="text-center py-8 text-red-500">{error.message}</div>;
  }

  const { resumes = [], screening_results = [], full_assesments = [] } = data;

  // Filtering resumes by search term
  const filteredResumes = resumes.filter((resume) =>
    resume.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);
  const currentResumes = filteredResumes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Updated handleViewDetails function
  const handleViewDetails = async (resume, screeningResult) => {
    try {
      // Find the freelancer that matches the resume email
      const freelancer = await Promise.all(
        full_assesments.map(async (assessment) => {
          const freelancerData = await fetchFreelancerDetails(assessment.freelancer, token);

          // Match freelancer's email with the resume email
          if (freelancerData.email === resume.email) {
            return freelancerData;
          }
        })
      );

      const matchedFreelancer = freelancer.filter(Boolean)[0];

      if (matchedFreelancer) {
        // Pass matched freelancer details to the details page
        navigate(`/resume/${resume.id}`, {
          state: {
            resume,
            screeningResult,
            freelancer_id: matchedFreelancer.id,
          },
        });
      } else {
        console.error("No freelancer found with the matching email.");
      }
    } catch (error) {
      console.error("Error while fetching freelancer details:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 mt-8">
      <section className="mb-12">
        <h2 className="text-lg font-normal text-center text-brand-dark-blue mb-6">
          Resumes and Screening Results
        </h2>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name"
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
        </div>

        {/* Resumes List */}
        {currentResumes.length === 0 && screening_results.length === 0 ? (
          <p className="text-gray-500 text-center">No resumes or screening results available.</p>
        ) : (
          currentResumes.map((resume) => {
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Resumes;
