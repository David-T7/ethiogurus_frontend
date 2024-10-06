import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdPending } from "react-icons/md";
import { MdHourglassEmpty } from "react-icons/md";
import { FaGlassWhiskey } from "react-icons/fa"; // Import glass icon
import SelectAppointmentDate from './SelectAppointmentDate'; // Import the new component

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [selectedCategory ,setSelectedCategory ] = useState()
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [appointment, setAppointmentID] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [pendingInterviews, setPendingInterviews] = useState([]);
  const navigate = useNavigate();
  const [appointmentDateSelected, setAppointmentDateSelected] = useState(false);

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

        let skillsData = response.data.skills || [];
        if (typeof skillsData === "string") {
          skillsData = JSON.parse(skillsData);
        }
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
              verified: skill.verified,
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

    const fetchPendingInterviews = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(
          "http://127.0.0.1:8000/api/appointments/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPendingInterviews(response.data);
      } catch (error) {
        console.error("Error fetching pending interviews:", error);
      }
    };

    fetchSkills();
    fetchPendingInterviews();
  }, []);

  const handleMouseEnter = (skill) => {
    let message = "";
    if (skill.both_practical_theoretical) {
      if (!skill.types.includes("theoretical")) {
        message += "You have not taken the theoretical test. ";
        setHoveredSkill(skill);
      }
      if (!skill.types.includes("practical")) {
        message += "You have not taken the practical test. ";
        setHoveredSkill(skill);
      }
    }

    const pendingInterview = pendingInterviews.find(
      (interview) =>
        interview.skills_passed.includes(skill.title) &&
        isValidAppointmentDate(interview.appointment_date)
    );

    if (pendingInterview) {
      message += `You have an upcoming interview on ${new Date(
        pendingInterview.appointment_date
      ).toLocaleString()}.`;
      setHoveredSkill(skill);
    }

    setMessage(message);
  };

  const handleCategoryMouseEnter = (category) => {
    let message = "";
    const pendingInterview = pendingInterviews.find(
      (interview) =>
        interview.category.includes(category) &&
        interview.appointment_date
    );


    if (pendingInterview) {
      message += `You have an upcoming interview on ${new Date(
        pendingInterview.appointment_date
      ).toLocaleString()}.`;
    }
    else{
      message += "You have passed to the interview round choose appointment date"
    }
    console.log("mouse enter message is ",message)
    setHoveredCategory(category)
    setMessage(message);
  };


  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    const pendingInterview = pendingInterviews.find((interview) =>
      interview.category.includes(category)
    );

    if (pendingInterview) {
      navigate("/appointment-details", {
        state: { appointment: pendingInterview },
      });
    }
  };

  const handleSelectDate =  (category) => {
    setSelectedCategory(category)
    const pendingInterview = pendingInterviews.find((interview) =>
      interview.category.includes(category)
    );
    setAppointmentID(pendingInterview)
    setModalIsOpen(true)
  }

  const handleMouseLeave = () => {
    setHoveredSkill(null);
    setHoveredCategory(null)
    setMessage(null);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const getProgressStyle = (types, bothPracticalTheoretical) => {
    let progressPercentage = 100;
    if (
      bothPracticalTheoretical &&
      (!types.includes("practical") || !types.includes("theoretical"))
    ) {
      progressPercentage = 50;
    }
    return {
      width: `${progressPercentage}%`,
      backgroundColor: "#4caf50",
    };
  };

  const isValidAppointmentDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {skills.length > 0 ? (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-normal ml-6 text-brand-blue">Skills</h1>
          <button
            onClick={() => navigate("/new-test")}
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

      <div className="p-6">
        {skills.map((group, index) => {
          const pendingInterview = pendingInterviews.find((interview) =>
            interview.skills_passed.includes(group.skills[0].title)
          );

          const appointmentDate = pendingInterview
            ? pendingInterview.appointment_date
            : null;

          return (
            <div key={index} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-normal mr-2 flex items-center text-brand-dark-blue">
                {group.category}
              {!appointmentDate ? (
                <button 
                className="ml-2 flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                onMouseEnter={() => handleCategoryMouseEnter(group.category)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleSelectDate(group.category)}
                >
                
                <span className="text-sm">Select Interview Date</span>
              </button>
              ) : (
                <button 
                className="flex items-center ml-4 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
                onMouseEnter={() => handleCategoryMouseEnter(group.category)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleCategoryClick(group.category)}

                >
                <span className="text-sm">Pending Interview..</span>
                </button>
              )}
              
              </span>
            </div>
              <ul className="list-disc pl-5">
                {group.skills.map((skill, i) => (
                  <li key={i} className="mb-4 relative">
                    {(hoveredSkill === skill || hoveredCategory === group.category  ) && (
                      <div className="absolute bottom-full mb-20 left-1/2 transform -translate-x-1/3 bg-brand-dark-blue text-white text-sm p-2 rounded shadow-lg">
                        {message}
                      </div>
                    )}
                    <button
                      type="button"
                      onMouseEnter={() => handleMouseEnter(skill)}
                      onMouseLeave={handleMouseLeave}
                      className={`relative bg-brand-blue text-white p-2 rounded-lg hover:bg-brand-dark-blue transition`}
                    >
                      <span className="mr-2 flex items-center">
                        {skill.title}
                        {skill.verified && (
                        <span className="ml-2 text-green-500">&#10003;</span>
                      )}
                      </span>
                      
                      <div className="relative w-full h-2 bg-gray-300 rounded-b-lg overflow-hidden mt-2">
                        <div
                          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                          style={getProgressStyle(
                            skill.types,
                            skill.both_practical_theoretical
                          )}
                        />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
       {/* Modal for changing the appointment date */}
     {modalIsOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <SelectAppointmentDate
            appointmentOptions={appointment.appointment_date_options} // Provide available slots
            appointmentID={appointment.id}
            onClose={handleCloseModal}
            setAppointmentDateSelected={setAppointmentDateSelected}
          />
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
