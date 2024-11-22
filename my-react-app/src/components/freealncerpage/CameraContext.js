import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useNavigate , useLocation } from "react-router-dom";

// Create the CameraContext
export const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [freelancerId, setFreelancerID_] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [testStatus, setTestStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  const canvasRef = useRef(document.createElement('canvas')); // Reusable canvas
  const location = useLocation()
  const startingPath = location.pathname.split('/').slice(0, 2).join('/'); // e.g., '/assessment-camera-check'

  // Retry with backoff
  const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        } else {
          throw error;
        }
      }
    }
  };

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start screenshot interval
      const interval = setInterval(() => {
        captureAndSendScreenshot();
      }, 10000); // Adjust interval time as needed
      setIntervalId(interval);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setErrorMessage('Error accessing camera. Please check your camera permissions.');
    }
  };
  const updateVideoSource = () => {
    if (videoRef.current && cameraStream) {
        videoRef.current.srcObject = cameraStream;
      }
  }

  // Function to stop the camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // Capture screenshot and send it to the server
const captureAndSendScreenshot = async () => {
  if (!cameraStream || !freelancerId || isTerminated) return;

  const video = videoRef.current;

  // Check if the video element and camera stream are available
  if (!video || video.readyState !== 4) { // readyState 4 means the video is ready to play
    console.warn("Video element is not ready or no stream available.");
    return;
  }

  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('screenshot', blob);
    formData.append('freelancer_id', freelancerId);

    try {
      await retryWithBackoff(async () => {
        const response = await axios.post(
          'http://127.0.0.1:8003/api/verify-snapshot/',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        handleVerificationResponse(response.data);

      }, 3, 1000); // Retry up to 3 times with exponential backoff
    } catch (error) {
      console.error('Failed to verify screenshot after retries:', error);
      setIsTerminated(true);
      if(startingPath === "/theory-skill-test" || startingPath === "/coding-skill-test" ){
        navigate('/skill-test-terminated');
      }
      else{
      navigate('/test-terminated');
      }
    }
  }, 'image/jpeg');
};

  const handleVerificationResponse = (data) => {
    if (data.action === 'pause') {
      if (testStatus !== "paused") {
        setTestStatus("paused");
        setRetryCount(retryCount + 1);
        setErrorMessage('Suspicious activity detected. Please adjust your position.');
        handlePauseTest();
      }
    } else if (data.action === 'terminate') {
      setIsTerminated(true);
      console.log("test is terminated")
      if(startingPath === "/theory-skill-test" || startingPath === "/coding-skill-test" ){
      navigate('/skill-test-terminated');
      }
      else{
      navigate('/test-terminated');
      }
    } else {
      if (testStatus !== "continued") {
        setTestStatus("continued");
        setRetryCount(0);
        handleResumeTest();
      }
    }
  };

  // Handle test pause
  const handlePauseTest = () => {
    setIsPaused(true);
    setShowModal(true);
    setErrorMessage('Test paused due to suspicious activity.');
  };

  // Handle test resume
  const handleResumeTest = () => {
    setIsPaused(false);
    setShowModal(false);
  };

  // UI Modal for Paused Test
  const PauseModal = () => (
    <div className="modal">
      <div className="modal-content">
        <h2>Test Paused</h2>
        <p>{errorMessage}</p>
        <button onClick={handleResumeTest}>Resume</button>
      </div>
    </div>
  );

  useEffect(() => {
    // Cleanup on component unmount
    return () => stopCamera();
  }, []);

  return (
    <CameraContext.Provider
      value={{
        startCamera,
        stopCamera,
        isCameraActive,
        videoRef,
        captureAndSendScreenshot,
        intervalId,
        setIntervalId,
        cameraStream,
        isTerminated,
        setFreelancerID_,
        errorMessage,
        isPaused,
        showModal,
        setErrorMessage,
        setIsPaused,
        setShowModal,
        updateVideoSource,
      }}
    >
      {children}
      {showModal && <PauseModal />}
      {/* Add video element for live camera feed */}
      <video ref={videoRef} autoPlay muted style={{ display: isCameraActive ? 'block' : 'none' }} />
    </CameraContext.Provider>
  );
};
