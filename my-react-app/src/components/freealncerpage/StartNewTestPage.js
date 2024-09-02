import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SkillDetailsModal from "./SkillDetailsModal";

const StartNewTestPage = () => {
  const [categories, setCategories] = useState({}); // State to store categories and technologies
  const [selectedCategory, setSelectedCategory] = useState(""); // State for the selected category
  const [selectedTechnology, setSelectedTechnology] = useState(""); // State for the selected technology
  const [selectedSkill, setSelectedSkill] = useState(null); // State for the selected skill
  const [codingTests, setCodingTests] = useState({}); // State for coding tests
  const [theoreticalTests, setTheoreticalTests] = useState({}); // State for theoretical tests
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [noTests, setNoTests] = useState(false); // State to handle no tests found
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch coding tests
        const token = localStorage.getItem('access'); // Get the access token from localStorage
        const codingResponse = await axios.get(
          "http://127.0.0.1:8002/api/practical-tests/grouped/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            }
          }
        );
        const codingTestsData = codingResponse.data || {}; // Ensure data is not undefined
        setCodingTests(codingTestsData);
        console.log("Coding response data: ", codingTestsData);
    
        // Fetch theoretical tests
        const theoreticalResponse = await axios.get(
          "http://127.0.0.1:8001/api/skill-tests/grouped/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            }
          }
        );
        const theoreticalTestsData = theoreticalResponse.data || {}; // Ensure data is not undefined
        setTheoreticalTests(theoreticalTestsData);
        console.log("Theoretical response data: ", theoreticalTestsData);
    
        // Combine data
        const combinedData = { ...theoreticalTestsData }; // Start with theoretical tests data
    
        // Add coding tests to combined data without duplicating technologies based on name
        for (const category in codingTestsData) {
          const codingTechnologies = codingTestsData[category];
          if (!combinedData[category]) {
            combinedData[category] = [];
          }
    
          // Use a map to track unique technologies by their name
          const technologyMap = new Map(combinedData[category].map((tech) => [tech.name, tech]));
    
          codingTechnologies.forEach((tech) => {
            if (!technologyMap.has(tech.name)) {
              technologyMap.set(tech.name, tech);
            }
          });
    
          // Convert map values back to an array
          combinedData[category] = Array.from(technologyMap.values());
        }
    
        setCategories(combinedData);
        setNoTests(Object.keys(combinedData).length === 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch tests");
        setLoading(false);
      }
    };
  
    fetchData();
  }, []); // Dependency array is empty, so this runs only once when the component mounts
  
  // Handle category change and reset technology selection
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setSelectedTechnology(""); // Reset selected technology when category changes
  };

  // Handle technology change
  const handleTechnologyChange = (event) => {
    setSelectedTechnology(event.target.value);
  };

  // Handle starting a test
  const handleStartTest = (testId, testType) => {
    navigate(`/test/${testId}/${testType}`);
  };

  // Handle skill click to open modal
  const handleSkillClick = async (technology) => {
    try {
      // Initialize empty arrays for tests
      let theoreticalTest = [];
      let codingTest = [];
      const token = localStorage.getItem('access'); // Get the access token from localStorage

      // Fetch random theoretical test by technology
      try {
        const theoreticalResponse = await axios.get(
          `http://127.0.0.1:8001/api/skill-tests/${technology}/`,{headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          }}
        );
        theoreticalTest = theoreticalResponse.data ? [theoreticalResponse.data] : [];
        console.log("the theoritical test is ",theoreticalTest)
      } catch (err) {
        console.error("Error fetching theoretical test:", err);
        // Optionally handle specific errors for theoretical test fetch
      }
  
      // Fetch random coding (practical) test by technology
      try {
        const codingResponse = await axios.get(
          `http://127.0.0.1:8002/api/practical-tests/${technology}/`,{headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          }}
        );
        codingTest = codingResponse.data ? [codingResponse.data] : [];
      } catch (err) {
        console.error("Error fetching coding test:", err);
        // Optionally handle specific errors for coding test fetch
      }
  
      // Set selected skill with the fetched tests
      setSelectedSkill({
        name: technology,
        codingTests: codingTest, // Directly use the fetched coding test array
        theoreticalTests: theoreticalTest, // Directly use the fetched theoretical test array
      });
  
    } catch (err) {
      console.error("Error handling skill click:", err);
      setError("Failed to fetch random tests");
    }
  };

  // Close the skill details modal
  const handleCloseModal = () => {
    setSelectedSkill(null);
  };

  // Handle "Next" button click
  const handleNextClick = () => {
    if (selectedTechnology) {
      handleSkillClick(selectedTechnology);
    }
  };

  // Loading and error handling UI
  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // No tests available message
  if (noTests)
    return <div className="text-center text-red-500">No tests available</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-normal mb-8 text-brand-blue">
        Start a New Test
      </h1>

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
                {item.technology.charAt(0).toUpperCase() +
                  item.technology.slice(1)}
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

export default StartNewTestPage;
