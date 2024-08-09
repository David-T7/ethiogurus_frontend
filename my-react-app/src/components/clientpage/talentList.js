import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaStar } from 'react-icons/fa';

// Example data
const talentData = [
  {
    id: 1,
    profilePicture: 'https://via.placeholder.com/100',
    title: 'Senior Developer',
    skills: ['JavaScript', 'React', 'Node.js'],
    experienceYears: 5,
    hourlyRate: '$60',
    rating: 4.5,
  },
  {
    id: 2,
    profilePicture: 'https://via.placeholder.com/100',
    title: 'UI/UX Designer',
    skills: ['Figma', 'Photoshop', 'Sketch'],
    experienceYears: 3,
    hourlyRate: '$45',
    rating: 4.7,
  },
  {
    id: 3,
    profilePicture: 'https://via.placeholder.com/100',
    title: 'Full Stack Developer',
    skills: ['Python', 'Django', 'JavaScript'],
    experienceYears: 7,
    hourlyRate: '$75',
    rating: 4.8,
  },
  {
    id: 4,
    profilePicture: 'https://via.placeholder.com/100',
    title: 'Front End Developer',
    skills: ['HTML', 'CSS', 'React'],
    experienceYears: 4,
    hourlyRate: '$50',
    rating: 4.2,
  },
  {
    id: 5,
    profilePicture: 'https://via.placeholder.com/100',
    title: 'Backend Developer',
    skills: ['Node.js', 'Express', 'MongoDB'],
    experienceYears: 6,
    hourlyRate: '$65',
    rating: 4.6,
  },
  {
    id: 6,
    profilePicture: 'https://via.placeholder.com/100',
    title: 'Graphic Designer',
    skills: ['Illustrator', 'InDesign', 'Photoshop'],
    experienceYears: 5,
    hourlyRate: '$55',
    rating: 4.4,
  },
  {
    id: 7,
    profilePicture: 'https://via.placeholder.com/100',
    title: 'Mobile App Developer',
    skills: ['Swift', 'Kotlin', 'React Native'],
    experienceYears: 4,
    hourlyRate: '$70',
    rating: 4.9,
  },
  {
    id: 8,
    profilePicture: 'https://via.placeholder.com/100',
    title: 'Project Manager',
    skills: ['Agile', 'Scrum', 'Jira'],
    experienceYears: 8,
    hourlyRate: '$85',
    rating: 4.3,
  },
];

const TalentListPage = () => {
  const navigate = useNavigate();
  const blurlimit = 3;

  const handleRedirectToSignup = () => {
    navigate('/hire-talent/finalize');
  };

  const handleCardClick = (e, id) => {
    e.stopPropagation(); // Prevents the card click event from propagating
    handleRedirectToSignup();
  };

  const handleContactClick = (e, id) => {
    e.stopPropagation(); // Prevents the contact button click event from propagating
    handleRedirectToSignup();
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-brand-blue mb-6">
          Here are some freelancers matched based on your project needs. 
          <br />
          <span className="text-brand-blue underline hover:text-brand-green cursor-pointer" onClick={handleRedirectToSignup}>
            Sign up
          </span> 
          <span> to see the full list.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {talentData.map((talent, index) => (
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
