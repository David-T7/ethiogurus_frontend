import React, { useState, useEffect } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import { FaEnvelope, FaStar } from 'react-icons/fa';
import axios from 'axios';

// Component
const TalentListPage = () => {
  const navigate = useNavigate();
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  let blurlimit = 0;

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const data = {
          "tech_stack":localStorage.getItem("selectedSkills"),
          "working_preference":localStorage.getItem("timeCommitment"),
          "project_duration":localStorage.getItem("projectDuration"),
          "project_budget":localStorage.getItem("projectBudget"),
          "project_description":localStorage.getItem("projectDescription"),
        }
        
        const response = await axios.get('http://127.0.0.1:8000/api/freelancers/search/' , data ); // Replace with your actual endpoint
        console.log("talent response list",response.data)
        setTalents(response.data.freelancers);
        if (location.pathname.startsWith('/create-project')) {
          blurlimit = 3
        }

      } catch (err) {
        setError('Failed to fetch talent data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, []);

  const handleRedirectToSignup = () => {
    if (location.pathname.startsWith('/create-project')) {
    navigate('/hire-talent/finalize');
    }
    else{
      navigate("/hire-talent/talent-list/{id}")
    }
  };

  const handleCardClick = (e, id) => {
    e.stopPropagation(); // Prevents the card click event from propagating
    handleRedirectToSignup();
  };

  const handleContactClick = (e, id) => {
    e.stopPropagation(); // Prevents the contact button click event from propagating
    navigate(`/contact-freelancer/${id}`);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-6xl mx-auto">
        {talents.length > 0 ? <h2 className="text-3xl font-normal text-brand-blue mb-6">
          Here are some freelancers matched based on your project needs. 
          <br />
          <span className="text-brand-blue underline hover:text-brand-dark-blue cursor-pointer" onClick={handleRedirectToSignup}>
            Sign up
          </span> 
          <span> to see the full list.</span>
        </h2>
        :
        <h2 className='text-center'>No freelancer found based on your requirement</h2>
        }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {talents.map((talent, index) => (
            <div
              key={talent.id}
              onClick={(e) => handleCardClick(e, talent.id)}
              className={`relative bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer ${
                index >= blurlimit ? 'opacity-50 grayscale-[20%] blur-sm pointer-events-none' : ''
              }`}
              style={{
                transition: 'filter 0.3s ease, opacity 0.3s ease',
              }}
            >
              <img
                src={talent.profilePicture}
                alt={`${talent.title}'s profile`}
                className="w-32 h-32 object-cover rounded-full border-4 border-brand-blue mb-4 transition-transform transform hover:scale-110"
              />
              <h3
                className={`text-2xl font-semibold text-brand-blue mb-2 ${
                  index >= blurlimit ? 'select-none' : ''
                }`}
              >
                {talent.title}
              </h3>
              <p
                className={`text-lg text-brand-gray-dark mb-2 ${
                  index >= blurlimit ? 'select-none' : ''
                }`}
              >
                <strong>Skills:</strong> {talent.skills.join(', ')}
              </p>
              <p
                className={`text-lg text-brand-gray-dark mb-2 ${
                  index >= blurlimit ? 'select-none' : ''
                }`}
              >
                <strong>Experience:</strong> {talent.experienceYears} years
              </p>
              <p
                className={`text-lg text-brand-gray-dark mb-2 ${
                  index >= blurlimit ? 'select-none' : ''
                }`}
              >
                <strong>Hourly Rate:</strong> {talent.hourlyRate}
              </p>
              <div
                className={`flex items-center mb-4 ${
                  index >= blurlimit ? 'select-none' : ''
                }`}
              >
                <FaStar className="text-yellow-500" />
                <span className="ml-2 text-lg text-brand-gray-dark">{talent.rating}</span>
              </div>
              {index < blurlimit && (
                <button
                  onClick={(e) => handleContactClick(e, talent.id)}
                  className="absolute pt-1 left-0 bottom-1 w-full bg-brand-blue text-white py-2 px-4 hover:bg-brand-dark-blue transition flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  <span>Contact Freelancer</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TalentListPage;
