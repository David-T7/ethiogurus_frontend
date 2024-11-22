import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams , useLocation} from 'react-router-dom';
import { SkillTestContext } from '../SkillTestContext';

const TestDetailPage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const { skillTests, loading, error, fetchSkillTests } = useContext(SkillTestContext);
  const location = useLocation()
  const startingPath = location.pathname.split('/').slice(0, 2).join('/'); // e.g., '/assessment-camera-check'
  const testDetails = type === 'theoretical' ? skillTests.theoretical : skillTests.practical;

  useEffect(() => {
    fetchSkillTests(id, type);
  }, [id, type]);

  const handleTestStart = () => {
    if (type === 'theoretical') {
      if(startingPath === "/skill-test"){
        navigate(`/theory-skill-test/${id}`,{
          state:{
            testDetails:testDetails
          }
        });
      }
      else{
      navigate(`/theory-test/${id}`,{
        state:{
          testDetails:testDetails
        }
      });
      }
    } else if (type === 'practical') {
      if(startingPath === "/skill-test"){
        navigate(`/coding-skill-test/${id}`);
      }
      else{
      navigate(`/coding-test/${id}`);
      }
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
          {type == 'theoretical' ? <h2 className="text-3xl font-normal">{testDetails?.title} Theoretical Test</h2>:<h2 className="text-3xl font-bold">{testDetails?.skill_type} Practical Test</h2>}
          {testDetails?.description && <p className="mt-4">{testDetails?.description}</p>}

        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Test Information</h3>
          <ul className="list-disc list-inside space-y-2">
          {testDetails?.duration_in_minutes && <li>Duration: {testDetails?.duration_in_minutes} minutes</li>}
           {testDetails?.category && <li>Category: {testDetails?.category}</li>}
            {testDetails?.passing_score && <li>Passing Score: {testDetails.passing_score}</li>}
          </ul>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Test Rules</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Do not close the browser window during the test.</li>
              <li>Cheating is strictly prohibited and will result in disqualification.</li>
              <li>All questions are mandatory.</li>
              <li>Your score will be displayed at the end of the test.</li>
            </ul>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              onClick={handleTestStart}
              className="bg-brand-green text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-dark-green transition-colors duration-300"
            >
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailPage;
