import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate , useLocation } from "react-router-dom";
import SkillDetailsModal from "./SkillDetailsModal";
import { decryptToken } from "../../utils/decryptToken";

// Utility to get and decrypt the token
const getDecryptedToken = () => {
  const encryptedToken = localStorage.getItem("access");
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  return decryptToken(encryptedToken, secretKey);
};

// Fetch tests
const fetchTests = async (token) => {
  // Fetch coding tests
  const codingResponse = await axios.get(
    "http://127.0.0.1:8002/api/practical-tests/grouped/",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // Fetch theoretical tests
  const theoreticalResponse = await axios.get(
    "http://127.0.0.1:8001/api/theoretical-tests/grouped/",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const codingTestsData = codingResponse.data || {};
  const theoreticalTestsData = theoreticalResponse.data || {};

  // Combine data with unique categories
  const uniqueCategories = new Set([
    ...Object.keys(codingTestsData),
    ...Object.keys(theoreticalTestsData),
  ]);

  const combinedData = {};
  uniqueCategories.forEach((category) => {
    combinedData[category] = [
      ...(theoreticalTestsData[category] || []),
      ...(codingTestsData[category] || []),
    ];
  });

  return combinedData;
};

// Fetch skill details
const fetchSkillDetail = async ({ queryKey }) => {
  const [, technology, token] = queryKey;

  const theoreticalResponse = await axios.get(
    `http://127.0.0.1:8001/api/theoretical-tests/${technology}/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const codingResponse = await axios.get(
    `http://127.0.0.1:8002/api/practical-tests/${technology}/`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return {
    name: technology,
    codingTests: codingResponse.data ? [codingResponse.data] : [],
    theoreticalTests: theoreticalResponse.data ? [theoreticalResponse.data] : [],
  };
};

const StartNewTestPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { skills } = location.state || null;
  const token = getDecryptedToken(); // Decrypt token once and reuse it

  // Fetch tests using React Query
  const { data: categories, isLoading, isError, error } = useQuery({
    queryKey: ["tests", token],
    queryFn: () => fetchTests(token), // Pass token explicitly
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    enabled: !!token, // Ensure token exists before making the request
  });

  // Fetch skill details using React Query
  const {
    data: skillDetails,
    refetch: fetchSkillDetails,
    isFetching: isFetchingSkillDetails,
  } = useQuery({
    queryKey: ["skillDetails", selectedTechnology, token], // Include token in queryKey
    queryFn: fetchSkillDetail,
    enabled: false, // Only fetch when triggered
  });

  // Handle category change
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedTechnology("");
  };

  // Handle technology change
  const handleTechnologyChange = (event) => {
    setSelectedTechnology(event.target.value);
  };

  // Handle "Next" button click
  const handleNextClick = () => {
    fetchSkillDetails().then(({ data }) => setSelectedSkill(data));
  };

  // Handle starting a test
  const handleStartTest = (testId, testType) => {
    navigate(`/check-verification/${testId}/${testType}`);
  };

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center text-red-500">{error.message}</div>;
  if (Object.keys(categories).length === 0) return <div className="text-center">No tests available</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-normal mb-8 text-brand-blue">Start a New Test</h1>

      {/* Category Selection */}
      <div className="mb-8">
        <label
          htmlFor="category"
          className="block text-lg font-normal text-brand-blue mb-2"
        >
          Select a Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-3/4 sm:w-1/2 px-4 py-2 border shadow-md border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
        >
          <option value="">-- Select Category --</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Technology Selection */}
      {selectedCategory && categories[selectedCategory] && (
        <div className="mb-8">
          <label
            htmlFor="technology"
            className="block text-lg font-normal text-brand-blue mb-2"
          >
            Select a Technology:
          </label>
          <select
            id="technology"
            value={selectedTechnology}
            onChange={handleTechnologyChange}
            className="w-3/4 sm:w-1/2 px-4 py-2 border shadow-md border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-300"
          >
            <option value="">-- Select Technology --</option>
            {Array.from(
              new Set(categories[selectedCategory]?.map((item) => item.technology))
            ).map((technology, index) => (
              <option key={index} value={technology}>
                {technology.charAt(0).toUpperCase() + technology.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Next Button */}
      {selectedTechnology && (
        <div className="mt-6">
          <button
            onClick={handleNextClick}
            disabled={isFetchingSkillDetails}
            className="w-3/4 sm:w-1/2 px-4 py-2 border bg-brand-blue text-white font-normal rounded-lg shadow-md hover:bg-brand-dark-blue transition-colors duration-300"
          >
            {isFetchingSkillDetails ? "Loading..." : "Next"}
          </button>
        </div>
      )}

      {/* Skill Details Modal */}
      {selectedSkill && (
        <SkillDetailsModal
          skill={selectedSkill}
          freelancerSkills = {skills}
          codingTests={selectedSkill.codingTests}
          theoreticalTests={selectedSkill.theoreticalTests}
          onClose={() => setSelectedSkill(null)}
          onStartTest={handleStartTest}
        />
      )}
    </div>
  );
};

export default StartNewTestPage;
