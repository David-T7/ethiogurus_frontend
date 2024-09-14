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
        console.log("freelancer data is ", response.data);
        const skillsData = response.data.skills;
        console.log("skills are ", skillsData);

        // Process the skills data to filter out only those with both theoretical and coding types
        const processedSkills = Object.entries(skillsData).reduce((acc, [type, titles]) => {
          if (type === "theoretical" || type === "practical") {
            titles.forEach(title => {
              const existingSkill = acc.find(skill => skill.title === title);
              if (existingSkill) {
                existingSkill.types.push(type);
              } else {
                acc.push({ title, types: [type] });
              }
            });
          }
          return acc;
        }, []);

        setSkills(processedSkills);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const handleStartTest = (skillId, testType) => {
    navigate(`/camera-check/${skillId}/${testType}`);
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
            className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
          >
           <span className="mr-2">New Skill Test</span>
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
            className="px-4 py-2 mt-2 bg-brand-green text-white rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
          >
            New Skill Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
          >
            <button
                  key={skill.id}
                  type="button"
                  disabled
                  className="bg-brand-blue text-white p-2 rounded-lg hover:bg-brand-dark-blue transition"
                >
                  <span className="mr-2">{skill.title}</span>
            </button>           
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
