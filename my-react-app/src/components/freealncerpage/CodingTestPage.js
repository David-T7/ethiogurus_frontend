import React, { useState, useEffect , useContext , useRef} from "react";
import { useNavigate, useParams , useLocation} from "react-router-dom";
import axios from "axios";
import FollowUpModal from "./FollowUpModal";
import beepSound from "../../audio/beepbeepbeep-53921.mp3";
import PauseModal from "./PauseModal";
import { CameraContext } from './CameraContext';
import { useQuery } from "@tanstack/react-query";
import { decryptToken } from "../../utils/decryptToken";
const fetchTestDetails = async ({ queryKey }) => {
  const [, { testId, token }] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8002/api/practical-test/${testId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchQuestions = async ({ queryKey }) => {
  const [, { testId, token }] = queryKey;
  const response = await axios.get(`http://127.0.0.1:8002/api/tests/${testId}/questions/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const fetchFreelancerDetails = async ({ queryKey }) => {
  const [, { token }] = queryKey;
  const response = await axios.get("http://127.0.0.1:8000/api/user/freelancer/manage/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};



const CodingTestPage = () => {
  const { id: testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [currentFollowUpIndex, setCurrentFollowUpIndex] = useState(0);
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [followUpTimer, setFollowUpTimer] = useState(0); // Timer for follow-up questions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [followUpSubmissionId, setFollowUpSubmissionId] = useState(null);
  const [freelancerId, setFreelancerId] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [finalQuestion, setFinalQuestion] = useState(false);
  const [followUpFinished, setFollowUpFinished] = useState(false);
  const [textareaShake, setTextareaShake] = useState(false);
  const warningSoundRef = useRef(new Audio(beepSound));
  const followupWarningSoundRef = useRef(new Audio(beepSound));
  const location = useLocation()
  const startingPath = location.pathname.split('/').slice(0, 2).join('/'); // e.g., '/assessment-camera-check'
  const { startCamera, stopCamera,errorMessage , setErrorMessage, isTerminated, setFreelancerID_, videoRef , showModal ,isPaused, setIsPaused , setShowModal ,updateVideoSource , cameraStream } = useContext(CameraContext);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status
  const { testDetails = null, assessment = null } = location.state || {};
  const [profilePicture , setProfilePicture] = useState(null)
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  // Fetch test details
  const {
    data: currentTest,
    isLoading: testLoading,
  } = useQuery({
    queryKey: ["testDetails", { testId, token }],
    queryFn: fetchTestDetails,
    staleTime: 300000, // Cache for 5 minutes
  });

  // Fetch test questions
  const { data: testData = [], isLoading: questionsLoading } = useQuery({
    queryKey: ["testQuestions", { testId, token }],
    queryFn: fetchQuestions,
    staleTime: 300000, // Cache for 5 minutes
  });

  // Fetch freelancer details
  const { data: freelancerDetails } = useQuery({
    queryKey: ["freelancerDetails", { token }],
    queryFn: fetchFreelancerDetails,
  });
  useEffect(() => {
    setFreelancerID_(freelancerDetails?.id);
    setFreelancerId(freelancerDetails?.id);
    setProfilePicture(freelancerDetails?.profilePicture);
    setTimer(currentTest?.duration_in_minutes * 60 || 0);
  },freelancerDetails)
  
  
  useEffect(() => {
    const fetchTestData = async () => {
      try {
        if (profilePicture) {
          const imageResponse = await fetch(profilePicture);
          const imageBlob = await imageResponse.blob();
          const imageFile = new File([imageBlob], 'profile_picture.jpg', { type: imageBlob.type });
          // setProfilePictureFile(imageFile);
          
          // Upload profile picture to the server
          const formData = new FormData();
          formData.append('freelancer_id', freelancerDetails.id);
          formData.append('profile_picture', imageFile);
          await axios.post("http://127.0.0.1:8003/api/fetch-and-store-profile-picture/", formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
          });
        }
        setTimer(currentTest.duration_in_minutes * 60); // Convert minutes to seconds
      } catch (error) {
        console.error("Failed to fetch test data", error);
      }
    };

    fetchTestData();
  }, [currentTest , testData , freelancerDetails]);

  useEffect(() => {
    if (timer <= 0 || isPaused || isModalOpen) return;

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalId);
          handleFinalizeTest(); // Finalize test when timer expires
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer , isPaused , isModalOpen]);

  useEffect(() => {
    if (followUpTimer === null || isPaused ) return;
    if (followUpTimer <= 0) {
      console.log("automatic submission trigered", timer);
      handleSubmitFollowUp(); // Automatically submit follow-up answers when timer expires
    }
    const intervalId = setInterval(() => {
      console.log("timer", followUpTimer);
      setFollowUpTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalId);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [followUpTimer , isPaused ]);

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

  const handleCodeChange = (e) => {
    const currentQuestion = testData[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [currentQuestion.id]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    const warningSound = warningSoundRef.current;
    if(isPaused){
      warningSound.pause()
    }
    if (isTerminated){
      warningSound.remove()
    }
    if (timer === 30 && !isPaused) {
      warningSound.play();
    } else if (timer > 30 || timer <= 0) {
      warningSound.pause();
      warningSound.currentTime = 0; // Reset the sound to the start
    }
  }, [timer , isPaused , isTerminated]);

  useEffect(() => {
    const warningSound = followupWarningSoundRef.current;
    if(isPaused){
      warningSound.pause()
    }
    if (isTerminated){
      warningSound.remove()
    }
    if (followUpTimer === 7 && !isPaused) {
      warningSound.play();
    } else if (followUpTimer > 7 || followUpTimer <= 0) {
      warningSound.pause();
      warningSound.currentTime = 0; // Reset the sound to the start
    }
  }, [followUpTimer , isPaused , isTerminated]);

  const handleFollowUpChange = (e) => {
    console.log("name is ");

    const { name, value } = e.target;
    console.log("name is ", name);
    console.log("value is ", value);
    setFollowUpAnswers({
      [name]: value,
    });
  };

  const fetchFollowUpQuestions = async (answerId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8002/api/follow-up-questions/${answerId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedFollowUpQuestions = response.data;

      setFollowUpQuestions(fetchedFollowUpQuestions);

      if (fetchedFollowUpQuestions.length > 0) {
        setCurrentFollowUpIndex(0);
        console.log("current follow up qeustion", fetchedFollowUpQuestions[0]);
        setFollowUpTimer(fetchedFollowUpQuestions[0].duration_in_seconds); // Set initial timer for the first follow-up question
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to fetch follow-up questions", error);
    }
  };

  const handleNextQuestion = async () => {
    const currentQuestion = testData[currentQuestionIndex];
    
    if (currentQuestion && !answers[currentQuestion.id]) {
      // Trigger the shaking effect by adding a class
      setTextareaShake(true);
      setTimeout(() => setTextareaShake(false), 500); // Remove the shake class after the animation
      return;
    }
  
    setIsSubmitting(true); // Set submitting state to true
    try {
      const responseData = await submitCurrentAnswer();
  
      if (responseData.score === 0) {
        // No follow-up needed, move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setFollowUpFinished(false);
        if (currentQuestionIndex === testData.length - 1) {
          // Fetch follow-up questions for the last question
          await fetchFollowUpQuestions(responseData.id);
          setFinalQuestion(true);
        } else {
          await fetchFollowUpQuestions(responseData.id);
        }
      }
    } catch (error) {
      console.error("Error during question submission:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextFollowUp = () => {
    if (currentFollowUpIndex < followUpQuestions.length - 1) {
      setCurrentFollowUpIndex(currentFollowUpIndex + 1);
      setFollowUpTimer(
        followUpQuestions[currentFollowUpIndex + 1].duration_in_seconds
      ); // Set timer for the next question
    }
  };

  const submitCurrentAnswer = async () => {
    const currentQuestion = testData[currentQuestionIndex];
    if (currentQuestion) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8002/api/skilltestsubmissions/${testId}/submit_answer/`,
          {
            question_id: currentQuestion.id,
            answer: answers[currentQuestion.id] || "",
            freelancer_id: freelancerId,
            submission_id: submissionId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("submit answer response is ", response.data);
        if (response.data) {
          if (response.data.id) {
            setCurrentAnswer(response.data.id);
          }
          if (response.data.submission_id) {
            setSubmissionId(response.data.submission_id); // Update state with the submission ID
          }
        }
        return response.data;
      } catch (error) {
        console.error("Failed to submit answer", error);
      }
    }
  };

  const submitFollowUpAnswers = async () => {
    if (!followUpFinished) {
      try {
        console.log("In submit follow-up method");
        console.log("Follow-up answers are ", followUpAnswers);

        // Default values
        let questionId = followUpQuestions[currentFollowUpIndex].id;
        let answer = "not answered";

        // Update the questionId and answer if followUpAnswers contains data
        if (Object.keys(followUpAnswers).length > 0) {
          questionId = Object.keys(followUpAnswers)[0]; // Assuming there's only one follow-up question
          answer = followUpAnswers[questionId];
          console.log("Answer is ", answer);
        }

        // Prepare payload
        const payload = {
          follow_up_submission: followUpSubmissionId,
          question: questionId,
          selected_option: answer, // Send null if answer is "not answered", adjust as needed
          test_answer: currentAnswer,
          freelancer_id: freelancerId,
          test_submission: submissionId,
        };

        // Send the follow-up answer to the backend
        const response = await axios.post(
          "http://127.0.0.1:8002/api/follow-up-question-answer/",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.follow_up_submission_id) {
          setFollowUpSubmissionId(response.data.follow_up_submission_id);
        }
        console.log("follow up sent as new ");

        // Clear follow-up answers after submission
        setFollowUpAnswers({});

        // Handle navigation after submission
        if (currentFollowUpIndex === followUpQuestions.length - 1) {
          setIsModalOpen(false);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          handleNextFollowUp();
        }
      } catch (error) {
        console.error(
          "Failed to submit follow-up answers",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const handleSubmitFollowUp = async () => {
    console.log("submitting follow up..");
    await submitFollowUpAnswers();
  };

  const handleFinalizeTest = async () => {
    try {
      await submitFollowUpAnswers(); // Submit follow-up answers before finalizing

      await axios.post(
        `http://127.0.0.1:8002/api/skilltestsubmissions/finalize-followUp-submission/${followUpSubmissionId}/`,
        {}, // Empty object for the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const finalizeResponse = await axios.post(
        "http://127.0.0.1:8002/api/skilltestsubmissions/finalize-submission/",
        {
          submission_id: submissionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { submission } = finalizeResponse.data;
      console.log("submission resutl is ",submission)
      if (submission.passed) {
        await updateFreelancerSkills(currentTest.skill_type);
      }
      else{
        await updateAssessmentStatus(submission.score , 70)
      }
      let testResultUrl = "/coding-test-result" 
      if(startingPath === "/coding-skill-test" ){
          testResultUrl = "/practical-test-result"
      }
      navigate(`${testResultUrl}/${submissionId}`, {
        state: {
          currentTest,
          submission_id: submissionId,
        },
      });
    } catch (error) {
      console.error("Failed to finalize test", error);
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
        `http://127.0.0.1:8000/api/full-assessment/${assessment.id}/`,
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
      
  //     // Handle freelancer.skills based on its type
  //     let currentSkills = Array.isArray(freelancer.skills) ? freelancer.skills : [];
    

  //     // Append the new skill under the appropriate category with both_practical_theoretical field
  //     const newSkill = {
  //       category: "Soft Skills",
  //       skill: skillType,
  //       type: "practical", // Default to theoretical
  //       both_practical_theoretical: true,
  //     };
  
  //     // Check if the skill already exists
  //     const skillExists = currentSkills.some(skill =>
  //       skill.category === "Soft Skills" && skill.skill.toLowerCase() === skillType.toLowerCase()
  //     );

  //     const theoreticalSkillExists = currentSkills.some(skill =>
  //       skill.category === "Soft Skills" && skill.type === "theoretical" && skill.skill.toLowerCase() === skillType.toLowerCase()
  //     );
  
  //     if (!skillExists) {
  //       currentSkills.push(newSkill);
  //       if(theoreticalSkillExists){
  //         await axios.patch(
  //           `http://127.0.0.1:8000/api/full-assessment/${freelancerId}/update/`,
  //           {
  //             depth_skill_assessment_status:"pending",
  //             soft_skills_assessment_status :"passed"
  //           },
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           } )   
  //       }
  //     }
  
  //     // Patch the freelancer profile with the updated skills (as a JSON string)
  //     await axios.patch(
  //       `http://127.0.0.1:8000/api/user/freelancer/manage/`,
  //       {
  //         skills: JSON.stringify(currentSkills), // Convert array to JSON string for storage
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  
  //     console.log("Freelancer skills updated successfully under the category:", "Soft skills");
  //   } catch (error) {
  //     console.error("Failed to update freelancer skills", error);
  //   }
  // };

  const updateFullAssessmentStatus = async () => {
    await axios.patch(
      `http://127.0.0.1:8000/api/full-assessment/${freelancerId}/update/`,
      {
        live_assessment_status:"pending",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } )

      await axios.patch(
        `http://127.0.0.1:8000/api/full-assessment/${assessment.id}/`,
        {
          depth_skill_assessment_status:"passed",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } )
  }

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
        type: "practical", // Default to theoretical
        both_practical_theoretical: bothPracticalTheoretical,
      };
  
      // Check if the skill already exists
      const skillExists = currentSkills.some(skill =>
        skill.category === category && skill.skill.toLowerCase() === skillType.toLowerCase() && newSkill.type==="practical"
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
          const assessmentUpdatePayload = {
            live_assessment_status: "pending",
          };
      
          const assessmentResponse = await axios.patch(
            `http://127.0.0.1:8000/api/full-assessment/${updatedFreelancer.id}/update/`,
            assessmentUpdatePayload,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          await axios.patch(
            `http://127.0.0.1:8000/api/full-assessment/${assessment.id}/`,
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
  
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="container mx-auto px-4 py-6">
       <div className="absolute top-8 right-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
             autoPlay 
             playsInline
            />
        </div>
      </div>
      {testData.length > 0 && currentQuestionIndex < testData.length && (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
            <h1 className="text-4xl font-normal mb-2">
              {currentTest?.skill_type} Practical Test
            </h1>
            <p className="mt-2 text-lg">Time Remaining: {formatTime(timer)}</p>
          </div>
          <div className="p-6">
            <div className="mb-2 p-6 rounded-lg">
              <h2 className="text-2xl font-normal mb-4 text-brand-dark-blue">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-lg mb-4">
                {testData[currentQuestionIndex].description}
              </p>
              <textarea
                className={`w-full h-64 border ${
                  textareaShake
                    ? "border-red-500 animate-shake"
                    : "border-gray-300"
                } p-4 rounded-lg`}
                value={answers[testData[currentQuestionIndex]?.id] || ""}
                onChange={handleCodeChange}
                placeholder="Write your answer here..."
              />
            </div>
            <div className="flex justify-between">
                {/* <button
                  className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button> */}
                <button
  className={`ml-auto py-2 px-4 mr-2 rounded ${
    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-brand-blue hover:bg-brand-dark-blue"
  } text-white`}
  onClick={handleNextQuestion}
  disabled={isSubmitting} // Disable the button when submitting
>
  {isSubmitting ? "Submitting..." : currentQuestionIndex === testData.length - 1 ? "Finish Test" : "Next Question"}
</button>
              </div>
          </div>
        </div>
      )}
      <PauseModal showModal={showModal} handleClose={() => setShowModal(false)} message={errorMessage} />


      <FollowUpModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }}
        followUpQuestions={followUpQuestions}
        currentFollowUpIndex={currentFollowUpIndex}
        onAnswerChange={handleFollowUpChange}
        onNext={handleNextFollowUp}
        onSubmit={handleSubmitFollowUp}
        timer={formatTime(followUpTimer)}
        handleFinalizeTest={handleFinalizeTest}
        finalQuestion={finalQuestion}
        setFollowUpFinished={setFollowUpFinished}
      />
    </div>
  );
};

export default CodingTestPage;
