import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';
import successSound from "../../audio/success.mp3";
import failureSound from "../../audio/failure.mp3";
import sentSound from "../../audio/sent.mp3";

const LivelinessTest = () => {
  const [cameraAccessible, setCameraAccessible] = useState(null);
  const [stage, setStage] = useState(1);
  const [progress, setProgress] = useState(50);
  const [instructions, setInstructions] = useState('Align your face straight to the camera');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(3); // Timer for countdown
  const [isTimerActive, setIsTimerActive] = useState(false); // Timer active state
  const location = useLocation();
  const freelancerData = location.state?.freelancerData;
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const successSoundRef = useRef(new Audio(successSound));
  const failureSoundRef = useRef(new Audio(failureSound));
  const sentSoundRef = useRef(new Audio(sentSound));

  const stages = [
    { id: 1, instruction: 'Face Match Test', next: 'Please align your face straight to the camera.', endpoint: '/api/verify/face-match/' },
    { id: 2, instruction: 'Smile Test', next: 'Please smile.', endpoint: '/api/verify/smile/' },
    { id: 3, instruction: 'Rotate Right', next: 'Please rotate your face to the right.', endpoint: '/api/verify/head-rotation-right/' },
    { id: 4, instruction: 'Rotate Left', next: 'Please rotate your face to the left.', endpoint: '/api/verify/head-rotation-left/' },
  ];

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        setIsCameraActive(true);
        setCameraAccessible(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraAccessible(false);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    let timerInterval;

    const manageTimer = () => {
      if (isTimerActive && timer > 0) {
        timerInterval = setInterval(() => {
          setTimer(prev => prev - 1);
        }, 1000);
      } else if (timer === 0) {
        clearInterval(timerInterval);
        setIsTimerActive(false);
        handleNextStage(); // Call without await, handle it internally
      }
    };

    manageTimer();
    return () => clearInterval(timerInterval);
  }, [isTimerActive, timer]);

  const verifyFreelancer = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/user/freelancer/manage/",
        {
          verified: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Failed to verify freelancer:", error);
      return false; // Ensures function always returns a boolean
    }
  };
  


  const captureSnapshot = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to create a blob from the canvas.'));
          return;
        }

        const formData = new FormData();
        formData.append('user_image', blob);
        formData.append('freelancer_id', freelancerData?.id);
        const currentStage = stages.find((s) => s.id === stage);
        const sentSound = sentSoundRef.current;
        sentSound.play();

        try {
          const token = localStorage.getItem('access');
          const response = await axios.post(
            `http://127.0.0.1:8005${currentStage.endpoint}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          resolve(response.data); // Resolve with the response data
        } catch (error) {
          reject(error); // Reject with the error
        }
      });
    });
  };

  const startTimer = () => {
    setTimer(10);
    setIsTimerActive(true);
    setIsSubmitting(true);
  }

  const handleNextStage = async () => {
    if (isTimerActive) return;

    try {
      const response = await captureSnapshot();
      console.log(`Response for ${stages[stage - 1].instruction}:`, response);

      if (response.status === 'success') {
        successSoundRef.current.play();
        if (stage < stages.length) {
          const nextStage = stage + 1;
          setStage(nextStage);
          setProgress((nextStage / stages.length) * 100);
          setInstructions(stages[nextStage - 1].next);
        } else {
          const verified = await verifyFreelancer()
          if (verified){
          alert('Liveliness test completed successfully!');
          Navigate("/setting")
          }
          else{
            alert('Retry Again!');
          }
          
        }
      } else {
        failureSoundRef.current.play();
        alert('Verification failed. Please ensure you are following the instructions correctly and try again.');
      }
    } catch (error) {
      console.error(`Error uploading image for ${stages[stage - 1].instruction}:`, error);
      failureSoundRef.current.play();
      const errorMessage = error.response?.data?.detail || 'An unexpected error occurred.';
      alert(`An error occurred: ${errorMessage}. Please check your internet connection or try reloading the page.`);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (cameraAccessible === null) {
    return <div className="text-center">Checking camera access...</div>;
  }

  if (cameraAccessible === false) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-8 bg-gray-100">
        <h2 className="text-2xl font-normal text-red-600">Camera Access Required</h2>
        <p className="mt-4">Please enable your camera to proceed with the test.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 mt-8">
      <h2 className="text-2xl font-normal text-brand-blue mb-4">Step {stage} of 5: Verification</h2>

      <div className="mb-6">
        <p className="text-lg text-gray-700 font-normal">{instructions}</p>
        {isTimerActive && <p className="text-xl text-red-600 font-normal">Position your face correctly in {timer} seconds...</p>} {/* Timer display */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <canvas ref={canvasRef} className="hidden"></canvas>
        <video
          ref={videoRef}
          className="w-60 h-80 object-cover rounded-full"
          style={{ clipPath: 'ellipse(50% 40%)' }}
          autoPlay
          playsInline
        />
      </div>

      <div className="flex justify-center mt-6">
      <button
        onClick={startTimer}
        disabled={isSubmitting}
        className={`w-full py-2 rounded-lg text-white ${isSubmitting ? 'bg-green-500' : 'bg-brand-green hover:bg-green-600'} transition duration-200`}
      >
        {isSubmitting ? `Submitting...` : `Start`}
      </button>
      </div>

    </div>
  );
};

export default LivelinessTest;
