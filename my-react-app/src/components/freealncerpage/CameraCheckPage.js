import React, { useState, useEffect } from 'react';
import { useNavigate , useParams} from 'react-router-dom';

const CameraCheckPage = () => {
  const [cameraAccessible, setCameraAccessible] = useState(null);
  const navigate = useNavigate();
  const { id, type } = useParams();

  useEffect(() => {
    const checkCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraAccessible(true);
        stream.getTracks().forEach(track => track.stop()); // Stop the camera after checking
      } catch (error) {
        setCameraAccessible(false);
      }
    };

    checkCameraAccess();
  }, []);

  const handleProceed = () => {
    navigate(`/test/${id}/${type}`); // Replace '/test-details' with the actual route to TestDetailPage
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
    <div className="flex flex-col items-center justify-top min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
      <h2 className="text-2xl font-normal">Camera Access Enabled</h2>
          <p className="mt-4">Your camera is enabled. You can now proceed to the test.</p>
        </div>
        <div className="p-6">
          <button
            onClick={handleProceed}
            className="bg-brand-green text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-dark-green transition-colors duration-300"
          >
            Proceed to Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCheckPage;
