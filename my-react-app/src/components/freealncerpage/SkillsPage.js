import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

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
        );
  
        console.log("Freelancer data:", response.data);
  
        // Check if skills are a valid JSON string and parse it
        let skillsData = response.data.skills || [];
  
        // If skillsData is a string, parse it into an array
        if (typeof skillsData === "string") {
          skillsData = JSON.parse(skillsData);
        }
  
        // If skillsData is not an array after parsing, wrap it into an array
        if (!Array.isArray(skillsData)) {
          skillsData = [skillsData];
        }
  
        const processedSkills = skillsData.reduce((acc, skill) => {
          const existingSkill = acc.find(
            (item) =>
              item.title === skill.skill && item.category === skill.category
          );
          if (existingSkill) {
            existingSkill.types.push(skill.type);
          } else {
            acc.push({
              title: skill.skill,
              types: [skill.type],
              category: skill.category,
              both_practical_theoretical: skill.both_practical_theoretical,
              verified: skill.verified,  // Add the verified field here
            });
          }
          return acc;
        }, []);
  
        const groupedSkills = processedSkills.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill);
          return acc;
        }, {});
  
        const skillArray = Object.keys(groupedSkills).map((category) => ({
          category,
          skills: groupedSkills[category],
        }));
  
        setSkills(skillArray);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
  
    fetchSkills();
  }, []);
  

  const handleStartTest = (skillTitle, testType) => {
    navigate(`/camera-check/${skillTitle}/${testType}`);
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

  const handleMouseEnter = (skill) => {
    if (skill.both_practical_theoretical) {
      console.log("skill types",skill)
      let message = "";
      if (!skill.types.includes("theoretical")) {
        message += "You have not taken the theoretical test. ";
         }
      else if (!skill.types.includes("practical")) {
        message += "You have not taken the practical test.";
      }
      setHoveredSkill(skill);
      setMessage(message);

     
    }
  };

  const handleMouseLeave = () => {
    setHoveredSkill(null);
    setMessage(null);
  };

  const getProgressStyle = (types, bothPracticalTheoretical) => {
    let progressPercentage = 100
      if(bothPracticalTheoretical && (!types.includes("practical") || !types.includes("theoretical")) ){
        progressPercentage = 50
    }
    return {
      width: `${progressPercentage}%`,
      backgroundColor: "#4caf50", // Green color for progress
    };
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
        <div className="p-6">
          {skills.map((group, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-normal text-brand-dark-blue mb-4">
                {group.category}
              </h2>
              <ul className="list-disc pl-5">
                {group.skills &&
                  group.skills.map((skill, i) => (
                    <li key={i} className="mb-4 relative">
                      {hoveredSkill === skill && skill.both_practical_theoretical && (!skill.types.includes("theoretical") || !skill.types.includes("practical")) &&  (
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-brand-dark-blue text-white text-sm p-2 rounded shadow-lg">
                          {message}
                        </div>
                      )}
                      <button
                        type="button"
                        onMouseEnter={() => handleMouseEnter(skill)}
                        onMouseLeave={handleMouseLeave}
                        className={`relative bg-brand-blue text-white p-2 rounded-lg hover:bg-brand-dark-blue transition`}
                                    >
                        <span className="mr-2">{skill.title}</span>
                        {skill.verified && (
                          <span className="ml-2 text-green-500">
                            &#10003; {/* Verified icon */}
                          </span>
                        )}
                        <div className="relative w-full h-2 bg-gray-300 rounded-b-lg overflow-hidden mt-2">
                          <div
                            className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                            style={getProgressStyle(skill.types, skill.both_practical_theoretical)}
                          />
                        </div>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
