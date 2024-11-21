import React from 'react';
import { useNavigate , useLocation} from 'react-router-dom';

const TestTerminatedPage = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const startingPath = location.pathname.split('/').slice(0, 2).join('/'); // e.g., '/assessment-camera-check'

  const handleReturnToSkillsPage = () => {
    if (startingPath === "/theory-skill-test" || startingPath === "/coding-skill-test"){
      navigate('/my-skills')
    }
    else{
      navigate('/skills')
    }
}

  return (
    <div className="flex flex-col justify-top items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-normal text-red-600 mb-4">Test Terminated</h1>
        <p className="text-gray-700 mb-6">
          Your test has been terminated due to suspicious activity or failure to comply with the rules.
        </p>
        <p className="text-gray-500 mb-6">
          If you believe this was a mistake, please contact support for further assistance.
        </p>
        <button
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={handleReturnToSkillsPage}
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default TestTerminatedPage;
