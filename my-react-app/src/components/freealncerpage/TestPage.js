import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams , useLocation } from "react-router-dom";
import axios from "axios";
import { SkillTestContext } from "../SkillTestContext"; // Adjust the path if needed
import beepSound from "../../audio/beepbeepbeep-53921.mp3";
import PauseModal from "./PauseModal";
import { CameraContext } from './CameraContext';
import { useQuery } from "@tanstack/react-query";
import { decryptToken } from "../../utils/decryptToken";

const fetchQuestions = async ({ queryKey }) => {
  const [_, { id, token }] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8001/api/tests/${id}/questions/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchFreelancerId = async ({ queryKey }) => {
  const [_, { token }] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/user/freelancer/manage/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { id, profile_picture } = response.data;

  // Handle profile picture
  if (profile_picture) {
    const imageResponse = await fetch(profile_picture);
    const imageBlob = await imageResponse.blob();
    const imageFile = new File([imageBlob], "profile_picture.jpg", { type: imageBlob.type });

    const formData = new FormData();
    formData.append("freelancer_id", id);
    formData.append("profile_picture", imageFile);
    await axios.post("http://127.0.0.1:8003/api/fetch-and-store-profile-picture/", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
  }
  return id;
};


const TestPage = () => {
  const { skillTests, loading, error } = useContext(SkillTestContext);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTestReady, setIsTestReady] = useState(false);
  const [freelancerId, setFreelancerId] = useState(null);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(null);
  const warningSoundRef = useRef(new Audio(beepSound));
  const [isShaking, setIsShaking] = useState(false);
  const [isColorChanged, setIsColorChanged] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const location = useLocation()
  const startingPath = location.pathname.split('/').slice(0, 2).join('/'); // e.g., '/assessment-camera-check'
  const { testDetails = null, assessment = null } = location.state || {};
  const navigate = useNavigate();
  const { id } = useParams();
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token

  const { startCamera, stopCamera,errorMessage , setErrorMessage, isTerminated, setFreelancerID_, videoRef , showModal ,isPaused, setIsPaused , setShowModal ,updateVideoSource , cameraStream } = useContext(CameraContext);

   // Fetch Questions
   const { data: fetchedQuestions, isLoading: questionsLoading, error: questionsError } = useQuery({
    queryKey: ["fetchQuestions", { id, token }],
    queryFn: fetchQuestions,
  });

  // Fetch Freelancer ID
  const { data: fetchedFreelancerId, isLoading: freelancerLoading, error: freelancerError } = useQuery({
    queryKey: ["fetchFreelancerId", { token }],
    queryFn: fetchFreelancerId,
  });

  useEffect(() => {
    if(fetchedFreelancerId){
      setFreelancerId(fetchedFreelancerId);
      setFreelancerID_(fetchedFreelancerId);
    }
}, [fetchedFreelancerId]);


  // Handle fetched questions
  useEffect(() => {
      if(fetchQuestions){
      setQuestions(fetchedQuestions);
      }
  }, [fetchedQuestions]);


  useEffect(() => {
    if (questions?.length > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      setQuestionTimeRemaining(currentQuestion.duration_in_seconds);
      setIsTestReady(true);
    }
  }, [questions, currentQuestionIndex]);

  // Start Camera & Capture
    useEffect(() => {
      startCamera(); // Start the camera when the component mounts
  
      return () => {
        stopCamera(); // Clean up the camera stream when the component unmounts
      };
  }, [freelancerId , isTerminated]);

  useEffect(() => {
    updateVideoSource()
  }, [cameraStream]);
  useEffect(() => {
    if (questionTimeRemaining === null || !isTestReady || isPaused) return;

    if (questionTimeRemaining <= 0) {
      handleSubmitCurrentQuestion();
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [questionTimeRemaining, isTestReady, isPaused]);

  useEffect(() => {
    if (questions?.length > 0) {
    const question = questions[currentQuestionIndex];
    if (question && question.duration_in_seconds) {
      setQuestionTimeRemaining(question.duration_in_seconds);
    }
  }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    const warningSound = warningSoundRef.current;
    if(isPaused){
      warningSound.pause()
    }
    if (isTerminated){
      warningSound.remove()
    }
    if (questionTimeRemaining === 10 && !isPaused) {
      warningSound.play();
    } else if (questionTimeRemaining > 10 || questionTimeRemaining <= 0) {
      warningSound.pause();
      warningSound.currentTime = 0; // Reset the sound to the start
    }
  }, [questionTimeRemaining , isPaused , isTerminated]);

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleSubmitCurrentQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id] || { id: "not given", text: "not given" };

    setSelectedAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers, [currentQuestion.id]: { id: selectedAnswer.id, text: selectedAnswer.text } };

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        handleSubmit(updatedAnswers);
      }

      return updatedAnswers;
    });
  };

  const handleAnswerSelection = (questionId, optionText, optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: { id: optionId, text: optionText },
    });
  };

  const handleNextQuestion = () => {
    if (!selectedAnswers[questions[currentQuestionIndex].id]) {
      setIsShaking(true);
      setIsColorChanged(true);

      setTimeout(() => {
        setIsShaking(false);
        setIsColorChanged(false);
      }, 500);

      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (finalAnswers = selectedAnswers) => {
    try {
      const submissionResponse = await axios.post(
        "http://127.0.0.1:8001/api/skilltestsubmissions/",
        {
          freelancer_id: freelancerId,
          test: id,
          start_time: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const submission = submissionResponse.data;

      const answersData = Object.entries(finalAnswers).map(([questionId, optionData]) => ({
        submission: submission.id,
        question: questionId,
        selected_option: optionData.id,
        answer_text: optionData.text,
      }));

      const answersResponse = await axios.post(
        "http://127.0.0.1:8001/api/bulk-answers/",
        { answers: answersData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (answersResponse.status !== 201) {
        throw new Error("Failed to submit answers");
      }

      const finalSubmission = await axios.patch(
        `http://127.0.0.1:8001/api/skilltestsubmissions/${submission.id}/`,
        {
          freelancer_id: freelancerId,
          test: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const passed = finalSubmission.data.submission.passed;
      if (passed) {
        await updateFreelancerSkills(skillTests.theoretical.title);
      }
      else{
        await updateAssessmentStatus(finalSubmission.data.submission.score , 70)
      }

      let testResultUrl = "/test-result" 
      if(startingPath === "/theory-skill-test"){
          testResultUrl = "/skill-test-result"
      }
      navigate(`${testResultUrl}`, {
        state: {
          questions,
          selectedAnswers,
          correctAnswers: questions.reduce((acc, question) => {
            const correctOption = question.options.find((option) => option.is_correct);
            acc[question.id] = correctOption ? correctOption.option_text : null;
            return acc;
          }, {}),
        },
      });
    } catch (error) {
      console.error("Error during submission:", error);
      setErrorMessage("Failed to submit test. Please try again.");
    }
  };

  const updateAssessmentStatus = async ( score, passingScore) => {
    let onhold = false;
    let onholdDuration = 0;
  
    // Determine onhold and dynamic onholdDuration based on the passingScore
    if (score < passingScore) {
      onhold = true;
      
      // Calculate how far below the passing score the freelancer's score is
      const scoreGap = passingScore - score;
  
      // Adjust onholdDuration based on scoreGap
      if (scoreGap <= 10) {
        onholdDuration = 15; // Hold for 15 days if score is within 10 points of passing
      } else if (scoreGap <= 20) {
        onholdDuration = 30; // Hold for 30 days if score is within 20 points of passing
      } else {
        onholdDuration = 45; // Hold for 45 days if score is more than 20 points below passing
      }
    }
  
    // Construct payload for the update
    const assessmentUpdatePayload = {
      on_hold: onhold,
      on_hold_duration: onholdDuration,
    };
  
    try {
      // Send patch request to update the assessment
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/assessments/${assessment.id}/`,
        assessmentUpdatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Check if the request was successful
      if (response.status === 200) {
        console.log("Assessment updated successfully:", response.data);
        return response.data;
      } else {
        console.error("Failed to update assessment:", response.status);
      }
    } catch (error) {
      console.error("Error updating assessment:", error);
    }
  };

  // const updateSoftSkills = async (skillType) => {
  //   try {
  //     // Fetch freelancer's current profile data
  //     const freelancerResponse = await axios.get(
  //       "http://127.0.0.1:8000/api/user/freelancer/manage/",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  
  //     const freelancer = freelancerResponse.data;
  
  //     // Parse and normalize skills
    
  //       // Ensure skills array is handled correctly
  //     let originalCurrentSkills = Array.isArray(freelancer.skills) ? freelancer.skills : [];
  //     let lowerCaseCurrentSkills = [];
  //     if (Array.isArray(freelancer.skills)) {
  //       lowerCaseCurrentSkills = freelancer.skills.map(skill => ({
  //         ...skill,
  //         category: skill.category.toLowerCase(),
  //         skill: skill.skill.toLowerCase(),
  //         type: skill.type.toLowerCase(),
  //       }));
  //     } else {
  //       lowerCaseCurrentSkills = JSON.parse(freelancer.skills || "[]").map(skill => ({
  //         ...skill,
  //         category: skill.category.toLowerCase(),
  //         skill: skill.skill.toLowerCase(),
  //         type: skill.type.toLowerCase(),
  //       }));
  //     }
  
  //     // Normalize the skillType for comparison
  //     const normalizedSkillType = skillType.toLowerCase();
  
  //     /// Append the new skill under the appropriate category with both_practical_theoretical field
  //     const newSkill = {
  //       category: "Soft Skills",
  //       skill: skillType,
  //       type: "theoretical", // Default to theoretical
  //       both_practical_theoretical: true,
  //     };
  
  //     // Check if the skill already exists
  //     const skillExists = lowerCaseCurrentSkills.some(
  //       (skill) =>
  //         skill.category === "soft skills" &&
  //         skill.type === "theoretical" &&
  //         skill.skill === normalizedSkillType
  //     );
  
  //     // Check if a practical version of the skill exists
  //     const practicalSkillExists = lowerCaseCurrentSkills.some(
  //       (skill) =>
  //         skill.category === "soft skills" &&
  //         skill.type === "practical" &&
  //         skill.skill === normalizedSkillType
  //     );
  
  //     console.log("Skills in database:", lowerCaseCurrentSkills);
  //     console.log("Skill exists:", skillExists, "Practical skill exists:", practicalSkillExists);
  
  //     if (!skillExists) {
  //       originalCurrentSkills.push(newSkill);

  //       if (practicalSkillExists) {
  //         await axios.patch(
  //           `http://127.0.0.1:8000/api/full-assessment/${freelancer.id}/update/`,
  //           {
  //             depth_skill_assessment_status: "pending",
  //             soft_skills_assessment_status: "passed",
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //       }
  //     }
  
  //     // Patch the freelancer profile with the updated skills
  //     await axios.patch(
  //       `http://127.0.0.1:8000/api/user/freelancer/manage/`,
  //       {
  //         skills: JSON.stringify(originalCurrentSkills),
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  
  //     console.log("Freelancer skills updated successfully.");
  //   } catch (error) {
  //     console.error("Failed to update freelancer skills:", error);
  //   }
  // };



  const updateFreelancerSkills = async (skillType) => {
    try {
      // Fetch the service data to get categories and technologies
      const servicesResponse = await axios.get("http://127.0.0.1:8000/api/services/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Filter services to find the matching skill in technologies (case insensitive)
      const matchingService = servicesResponse.data.find(service =>
        service.technologies.some(tech => tech.name.toLowerCase() === skillType.toLowerCase())
      );
  
      if (!matchingService) {
        console.error("No matching service found for the skill type.");
        return;
      }
  
      // Fetch freelancer's current profile data
      const freelancerResponse = await axios.get(
        "http://127.0.0.1:8000/api/user/freelancer/manage/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const freelancer = freelancerResponse.data;
  
      // Handle freelancer.skills based on its type
      let currentSkills = Array.isArray(freelancer.skills) ? freelancer.skills : [];
  
      // Define the category
      // const category = matchingService.name;
      const category = testDetails?.category
      // Fetch theoretical and practical tests
      const theoreticalTestsResponse = await axios.get("http://127.0.0.1:8001/api/skilltests/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const practicalTestsResponse = await axios.get("http://127.0.0.1:8002/api/practical-test/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const theoreticalTests = theoreticalTestsResponse.data;
      const practicalTests = practicalTestsResponse.data;
      // Check if the skill is in both theoretical and practical tests
      const inTheoretical = theoreticalTests.some(test => test.title.toLowerCase() === skillType.toLowerCase());
      const inPractical = practicalTests.some(test => test.skill_type.toLowerCase() === skillType.toLowerCase());
  
      const bothPracticalTheoretical = inTheoretical && inPractical;
  
      // Append the new skill under the appropriate category with both_practical_theoretical field
      const newSkill = {
        category: category,
        skill: skillType,
        type: "theoretical", // Default to theoretical
        both_practical_theoretical: bothPracticalTheoretical,
      };
  
      // Check if the skill already exists
      const skillExists = currentSkills.some(skill =>
        skill.category === category && skill.skill.toLowerCase() === skillType.toLowerCase() && newSkill.type === "theoretical"
      );
  
      if (!skillExists) {
        currentSkills.push(newSkill);
      }
  
      try {
        // Step 1: Patch the freelancer profile with the updated skills
        const updatedFreelancerResponse = await axios.patch(
          `http://127.0.0.1:8000/api/user/freelancer/manage/`,
          { skills: JSON.stringify(currentSkills) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      
        console.log("Freelancer skills updated successfully:", updatedFreelancerResponse.data);
      
        // Step 2: Use the updated data from the response
        const updatedFreelancer = updatedFreelancerResponse.data;
      
        let updatedSkills;
      
        // Check if skills is a JSON string and parse it
        if (typeof updatedFreelancer.skills === "string") {
          try {
            updatedSkills = JSON.parse(updatedFreelancer.skills);
          } catch (parseError) {
            console.error("Failed to parse skills JSON:", parseError);
            return;
          }
        } else if (Array.isArray(updatedFreelancer.skills)) {
          updatedSkills = updatedFreelancer.skills;
        } else {
          console.error("Unexpected format for skills:", updatedFreelancer.skills);
          return;
        }
      
        // Step 3: Count the skills in the same category
        const skillsInCategory = updatedSkills.filter(skill => skill.category === category).length;
        console.log("Skills in the same category:", skillsInCategory);
      
        // Step 4: Update assessment status if the category has >= 2 skills
        if (skillsInCategory >= 2) {
          await axios.patch(
            `http://127.0.0.1:8000/api/assessments/${assessment.id}/`,
            {depth_skill_assessment_status:"passed"},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if(assessment.live_assessment_status === "not_started"){
         await axios.patch(
            `http://127.0.0.1:8000/api/assign-live-assessment-appointment/${updatedFreelancer.id}/`,
            {
              applied_position_id:assessment.applied_position
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        else{
          console.log("live assmment started!")
        }
        const assessmentUpdatePayload = {
          live_assessment_status: "pending",
        };
        const assessmentResponse = await axios.patch(
          `http://127.0.0.1:8000/api/full-assessment/${updatedFreelancer.id}/update/`,
          assessmentUpdatePayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
          console.log(`Assessment for category ${category} marked as finished:`, assessmentResponse.data);
        }
      } catch (error) {
        // Improved error handling
        if (error.response) {
          console.error("Error response:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
        console.error("Failed to update freelancer skills:", error);
      }
    } catch (error) {
      console.error("Failed to update freelancer skills", error);
    }
  };
  
  

  const handleResumeTest = () => {
    setIsPaused(false);
    setShowModal(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (questionsLoading || freelancerLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (questionsError || freelancerError) {
    return <div className="text-center text-red-500">Error: {questionsError?.message || freelancerError?.message}</div>;
  }


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="absolute top-4 right-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
             autoPlay 
             playsInline
            />
        </div>
      </div>
       {/* Test Content */}
       {isTestReady ? (
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
              <h2 className="text-2xl font-normal">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <p className={`mt-2 text-lg ${questionTimeRemaining <= 10 ? "text-red-600" : ""}`}>
                Time Remaining: {formatTime(questionTimeRemaining)}
              </p>
            </div>
            <div className="p-6">
              <p className={`text-lg mb-4 ${isShaking ? "animate-shake" : ""} ${isColorChanged ? "text-red-600" : ""}`}>
                {questions[currentQuestionIndex]?.text || "Loading question..."}
              </p>
              <div className="space-y-4">
                {questions[currentQuestionIndex]?.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-4">
                    <input
                      type="radio"
                      id={option.id}
                      name={`question-${currentQuestionIndex}`}
                      value={option.id}
                      checked={selectedAnswers[questions[currentQuestionIndex]?.id]?.id === option.id}
                      onChange={() => handleAnswerSelection(questions[currentQuestionIndex].id, option.option_text, option.id)}
                      className="w-4 h-4 text-brand-blue border-gray-300"
                    />
                    <label htmlFor={option.id} className="text-gray-700">
                      {option.option_text}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                {currentQuestionIndex < questions.length - 1 && (
                  <button
                    onClick={handleNextQuestion}
                    className="ml-auto py-2 px-4 rounded bg-brand-blue text-white hover:bg-brand-dark-blue"
                  >
                    Next Question
                  </button>
                )}
              </div>
              {currentQuestionIndex === questions.length - 1 && (
                <button
                  onClick={() => handleSubmit()}
                  className="mt-4 w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-800"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-lg text-gray-700">
                Loading your test, please wait...
              </p>
            </div>
          </div>
        )}
        <PauseModal showModal={showModal} handleClose={() => setShowModal(false)} message={errorMessage} />
      </div>
    );
  };
  
  export default TestPage;