import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { CameraContext } from "./CameraContext";
import { decryptToken } from "../../utils/decryptToken";
import PauseModal from "./PauseModal";

const CameraCheckPage = () => {
  const [cameraStatus, setCameraStatus] = useState(null);
  const [cameraCheckReady, setCameraCheckReady] = useState(false);
  const [freelancerId, setFreelancerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPurpose, setShowPurpose] = useState(true);
  const { startCamera, stopCamera, videoRef, setFreelancerID_, setShowModal, showModal , updateVideoSource , setPreTestCameraCheck,setPreTestCheckPassPath , cameraStream } =
  useContext(CameraContext);
  const { id, type } = useParams();
  const encryptedToken = localStorage.getItem("access");
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const token = decryptToken(encryptedToken, secretKey);
  const location = useLocation();
  const assessment = location.state || null;
  const errorMessage = "Please adjust your position in the camera and try again.";
  const fetchFreelancerId = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/user/freelancer/manage/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const freelancer_id = response.data.id;
      const profile_picture = response.data.profile_picture;
      if (profile_picture) {
        const imageResponse = await fetch(profile_picture);
        const imageBlob = await imageResponse.blob();
        const imageFile = new File([imageBlob], "profile_picture.jpg", { type: imageBlob.type });

        const formData = new FormData();
        formData.append("freelancer_id", freelancer_id);
        formData.append("profile_picture", imageFile);
        await axios.post("http://127.0.0.1:8003/api/fetch-and-store-profile-picture/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setFreelancerId(freelancer_id);
      setFreelancerID_(freelancer_id);
      const path = location.pathname.startsWith("/assessment-camera-check") 
      ? `/skill-test/${id}/${type}`
      : `/test/${id}/${type}`;
      setPreTestCheckPassPath({ path, state: { assessment } });
      setPreTestCameraCheck(true);
    } catch (error) {
      console.error("Error fetching freelancer ID:", error);
    }
  };

  useEffect(() => {
    fetchFreelancerId();
    setPreTestCameraCheck(true);
  }, []);

  useEffect(() => {
    if (cameraCheckReady && freelancerId) {
      setLoading(true);
      startCamera();
    }
    return () => stopCamera();
  }, [cameraCheckReady ,freelancerId]);

  const handleStartCameraCheck = () => {
    setShowPurpose(false);
    setCameraCheckReady(true);
  };
   useEffect(() => {
    if(cameraStream){
      updateVideoSource()
    }
    }, [cameraStream]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 overflow-hidden">
      <div className="items-center justify-center">
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
        </div>
      </div>

      {showPurpose ? (
        <div className="text-center">
          <h2 className="text-2xl text-brand-dark-blue font-normal">Pre-Test Camera Check</h2>
          <p className="text-gray-700 mt-4">
            This check ensures that your camera is functioning properly and can verify your identity for the assessment.
          </p>
          <button
            onClick={handleStartCameraCheck}
            className="mt-6 bg-brand-blue text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
          >
            Start Camera Check
          </button>
        </div>
      ) : loading ? (
        <div className="text-center">
          <h2 className="text-xl font-bold text-blue-600">Verifying Test Taker...</h2>
          <div className="mt-4 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
          </div>
          <p className="text-gray-600 mt-2">Please wait while we verify your identity...</p>
        </div>
      ) : null}

      <PauseModal showModal={showModal} handleClose={() => setShowModal(false)} message={errorMessage} title={"Pre-test camera check paused"} />
    </div>
  );
};

export default CameraCheckPage;
