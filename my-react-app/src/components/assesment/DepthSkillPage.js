import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SkillDetailsModal from "../freealncerpage/SkillDetailsModal";
import { decryptToken } from "../../utils/decryptToken";
const fetchServiceName = async (appliedPosition) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/services/${appliedPosition}/`);
    return response.data.name;
};

const fetchTests = async ({ appliedPositionNames, token }) => {
  try {
    const [codingTestsResponse, theoreticalTestsResponse] = await Promise.all([
      axios.post(
        "http://127.0.0.1:8002/api/practical-tests/assessment/",
        { applied_position_names: [appliedPositionNames] },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.post(
        "http://127.0.0.1:8001/api/theoretical-tests/assessment/",
        { applied_position_names: [appliedPositionNames] },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    ]);

    const codingTests = codingTestsResponse.data || {};
    const theoreticalTests = theoreticalTestsResponse.data || {};

    console.log("Coding Tests:", codingTests);
    console.log("Theoretical Tests:", theoreticalTests);

    // Combine data
    const combinedData = {};

    // Helper function to normalize categories
    const normalizeCategory = (category) => category.trim().toLowerCase();

    // Add theoretical tests to combinedData
    for (const category in theoreticalTests) {
      const normalizedCategory = normalizeCategory(category);
      if (!combinedData[normalizedCategory]) {
        combinedData[normalizedCategory] = [];
      }
      combinedData[normalizedCategory].push(...theoreticalTests[category]);
    }

    // Add coding tests to combinedData
    for (const category in codingTests) {
      const normalizedCategory = normalizeCategory(category);
      if (!combinedData[normalizedCategory]) {
        combinedData[normalizedCategory] = [];
      }

      // Use a map to merge unique technologies
      const techMap = new Map(
        combinedData[normalizedCategory].map((tech) => [tech.technology, tech])
      );

      codingTests[category].forEach((tech) => {
        if (!techMap.has(tech.technology)) {
          techMap.set(tech.technology, tech);
        }
      });

      combinedData[normalizedCategory] = Array.from(techMap.values());
    }

    return combinedData;
  } catch (error) {
    console.error("Error fetching tests:", error);
    return {};
  }
};


const fetchSkillTests = async ({ technology, token }) => {
  const [theoreticalResponse, codingResponse] = await Promise.allSettled([
    axios.get(`http://127.0.0.1:8001/api/theoretical-tests/${technology}/`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    axios.get(`http://127.0.0.1:8002/api/practical-tests/${technology}/`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const theoreticalTests = theoreticalResponse.status === "fulfilled" ? [theoreticalResponse.value.data] : [];
  const codingTests = codingResponse.status === "fulfilled" ? [codingResponse.value.data] : [];

  return { theoreticalTests, codingTests };
};

const DepthSkillTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { assessment } = location.state || null;

  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Fetch applied position names
  const { data: appliedPositionNames, isLoading: loadingPositions, error: positionsError } = useQuery({
    queryKey: ["appliedPositionName", assessment],
    queryFn: () => fetchServiceName(assessment.applied_position),
  });

  // Fetch test categories and technologies
  const { data: categories, isLoading: loadingTests, error: testsError } = useQuery({
    queryKey: ["tests", appliedPositionNames],
    queryFn: () => fetchTests({ appliedPositionNames, token }),
  });

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedTechnology("");
  };

  const handleTechnologyChange = (event) => {
    setSelectedTechnology(event.target.value);
  };

  const handleSkillClick = async (technology) => {
    try {
      const { theoreticalTests, codingTests } = await fetchSkillTests({ technology, token });
      setSelectedSkill({
        name: technology,
        theoreticalTests,
        codingTests,
      });
    } catch (error) {
      console.error("Error fetching skill tests:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedSkill(null);
  };

  // Handle starting a test
  const handleStartTest = (testId, testType) => {
    navigate(`/verification-check/${testId}/${testType}`,{
      state:{assessment:assessment}
    });
  };

  // const handleStartTest = (testId, testType) => {
  //   navigate(`/assessment-camera-check/${testId}/${testType}`,{
  //     state:{assessment:assessment}
  //   });
  // };

  if (loadingPositions || loadingTests) return <div className="text-center">Loading...</div>;
  if (positionsError || testsError) return <div className="text-center text-red-500">Failed to load tests</div>;

  if (!categories || Object.keys(categories).length === 0) {
    return <div className="text-center text-red-500">No tests available</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-thin mb-8 text-brand-blue">Start a New Test</h1>

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
            {categories[selectedCategory]?.map((item) => (
              <option key={item.id} value={item.technology}>
                {item.technology.charAt(0).toUpperCase() + item.technology.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Next Button */}
      {selectedTechnology && (
        <div className="mt-6">
          <button
            onClick={() => handleSkillClick(selectedTechnology)}
            className="w-3/4 sm:w-1/2 px-4 py-2 border bg-brand-blue text-white font-normal rounded-lg shadow-md hover:bg-brand-dark-blue transition-colors duration-300"
          >
            Next
          </button>
        </div>
      )}

      {/* Skill Details Modal */}
      {selectedSkill && (
        <SkillDetailsModal
          skill={selectedSkill}
          codingTests={selectedSkill.codingTests}
          theoreticalTests={selectedSkill.theoreticalTests}
          onClose={handleCloseModal}
          onStartTest={handleStartTest}
        />
      )}
    </div>
  );
};

export default DepthSkillTestPage;
