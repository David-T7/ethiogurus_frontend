import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create the CameraContext
export const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false); // New state for pause status
  const [isTerminated, setIsTerminated] = useState(false); // New state for pause status
  const [freelancerId, setFreelancerID_] = useState(false); // New state for pause status
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("access");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()
  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Set interval to capture screenshots if needed
      const interval = setInterval(() => {
        captureAndSendScreenshot(stream);
      }, 10000); // Adjust interval time as needed
      setIntervalId(interval);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

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
    if (isTerminated){
        clearInterval(intervalId);
        setIntervalId(null);
    }
  };

  const updateVideoSource = () => {
    if (videoRef.current && cameraStream) {
        videoRef.current.srcObject = cameraStream;
      }
  }

  const captureAndSendScreenshot = async (stream) => {
    if (!stream || !freelancerId) 
        return;
  
    const video = videoRef.current;
    if (!video) return;
  
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('screenshot', blob);
      formData.append('freelancer_id', freelancerId);
  
      const maxRetries = 3; // Maximum number of retry attempts
      let retryCount = 0; // Retry counter
  
      const verifySnapshot = async () => {
        try {
          const response = await axios.post(
            'http://127.0.0.1:8003/api/verify-snapshot/',
            formData,
            {
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
            }
          );
  
          if (response.data.action === 'pause') {
            setErrorMessage('Suspicious activity detected. Please adjust your position.');
            handlePauseTest();
            if (retryCount < maxRetries) {
              retryCount++;
              setTimeout(verifySnapshot, 5000); // Retry after 3 seconds
            } else {
              setIsTerminated(true)
              navigate('/test-terminated');
            }
          } else if (response.data.action === 'terminate') {
            setIsTerminated(true)
            navigate('/test-terminated');
          } else {
            handleResumeTest(); // Resume test if no action is required
          }
        } catch (error) {
          console.error('Error during verification:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(verifySnapshot, 3000); // Retry after 3 seconds
          } else {
            setIsTerminated(true)
            navigate('/test-terminated');
          }
        }
      };
  
      verifySnapshot();
    }, 'image/jpeg');
  };

  const handlePauseTest = () => {
    setIsPaused(true);
    setShowModal(true);
  };

  const handleResumeTest = () => {
    setIsPaused(false);
    setShowModal(false);
  };

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
        updateVideoSource,
        cameraStream,
        isTerminated,
        setFreelancerID_,
        errorMessage,
        isPaused,
        setErrorMessage,
        showModal,
        setIsPaused,
        setShowModal,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};
