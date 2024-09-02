// src/components/SkillsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SkillDetailsModal from "./SkillDetailsModal";
import { useNavigate } from "react-router-dom";

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const navigate = useNavigate();

  // Fetch skills from the backend when the component mounts
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/freelancer/manage/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Adjust the URL based on your API endpoint
        setSkills(response.data.skills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const handleStartTest = (skillId, testType) => {
    navigate(`/test/${skillId}/${testType}`);
  };

  const openSkillDetails = (skill) => {
    setSelectedSkill(skill);
  };

  const closeSkillDetails = () => {
    setSelectedSkill(null);
  };

  const handleTakeNewSkillTest = () => {
    navigate("/new-test");
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {skills.length > 0 ? (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-normal ml-6 text-brand-blue">Skills</h1>
          <button
            onClick={handleTakeNewSkillTest}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
          >
            Take New Skill Test
          </button>
        </div>
      ) : (
        <p className="text-lg text-brand-dark-gray text-center">
          There are no skills available at the moment.
        </p>
      )}

      {skills.length === 0 ? (
      <div className="flex justify-center mb-6">
      <button
        onClick={handleTakeNewSkillTest}
        className="px-4 py-2 mt-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
      >
        Take New Skill Test
      </button>
    </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((category, index) => (
            <motion.div
              key={index}
              className="p-6 hover:shadow-2xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-2xl font-normal mb-4 text-brand-dark-blue">
                {category.category}
              </h2>

              <ul className="space-y-4">
                {category.skills.map((skill) => (
                  <motion.li
                    key={skill.id}
                    className="p-4 shadow-md rounded-lg cursor-pointer hover:bg-brand-light-blue transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openSkillDetails(skill)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-normal text-brand-dark-green">
                        {skill.name}
                      </h3>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          skill.passed
                            ? "bg-brand-green text-white"
                            : "bg-brand-orange text-white"
                        }`}
                      >
                        {skill.passed ? "Passed" : "Not Passed"}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}

      {selectedSkill && (
        <SkillDetailsModal
          skill={selectedSkill}
          onClose={closeSkillDetails}
          onStartTest={handleStartTest}
        />
      )}
    </div>
  );
};

export default SkillsPage;
