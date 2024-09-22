import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { SkillTestContext } from "../SkillTestContext"; // Adjust the path if needed
import beepSound from "../../audio/beepbeepbeep-53921.mp3";
import PauseModal from "./PauseModal";
import { CameraContext } from './CameraContext';

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

  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("access");


  const { startCamera, stopCamera,errorMessage , setErrorMessage, isTerminated, setFreelancerID_, videoRef , showModal ,isPaused, setIsPaused , setShowModal ,updateVideoSource , cameraStream } = useContext(CameraContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8001/api/tests/${id}/questions/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setErrorMessage("Error fetching test questions. Please try again.");
      }
    };

    fetchQuestions();
  }, [id]);

  useEffect(() => {
    const fetchFreelancerId = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/freelancer/manage/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { id, profile_picture } = response.data;
        setFreelancerId(id);
        setFreelancerID_(id)

        if (profile_picture) {
          const imageResponse = await fetch(profile_picture);
          const imageBlob = await imageResponse.blob();
          const imageFile = new File([imageBlob], 'profile_picture.jpg', { type: imageBlob.type });
          // setProfilePictureFile(imageFile);
          
          // Upload profile picture to the server
          const formData = new FormData();
          formData.append('freelancer_id', id);
          formData.append('profile_picture', imageFile);
          await axios.post("http://127.0.0.1:8003/api/fetch-and-store-profile-picture/", formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
          });
        }
      } catch (error) {
        console.error("Error fetching freelancer data:", error);
        setErrorMessage("Error loading freelancer information.");
      }
    };

    fetchFreelancerId();
  }, [token]);

  useEffect(() => {
    if (questions.length > 0) {
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
    const question = questions[currentQuestionIndex];
    if (question && question.duration_in_seconds) {
      setQuestionTimeRemaining(question.duration_in_seconds);
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

      navigate("/test-result", {
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
      const category = matchingService.name;
  
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
        skill.category === category && skill.skill.toLowerCase() === skillType.toLowerCase()
      );
  
      if (!skillExists) {
        currentSkills.push(newSkill);
      }
  
      // Patch the freelancer profile with the updated skills (as a JSON string)
      await axios.patch(
        `http://127.0.0.1:8000/api/user/freelancer/manage/`,
        {
          skills: JSON.stringify(currentSkills), // Convert array to JSON string for storage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Freelancer skills updated successfully under the category:", category);
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