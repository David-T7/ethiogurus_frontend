import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import profilePic from "../../images/default-profile-picture.png"; // Default profile picture

const FreelancerDetailPage = () => {
  const { id: freelancerId } = useParams();
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/user/freelancer/${freelancerId}/`);
        setFreelancerData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, [freelancerId]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8">Error fetching freelancer details</div>;
  if (!freelancerData) return <div className="text-center py-8">No data available</div>;

  const {
    profile_picture,
    full_name,
    bio,
    skills,
    prev_work_experience,
    portfolio,
    certifications,
    is_active,
    verifed,
    professional_title,
    preferred_working_hours,
  } = freelancerData;

  // Parse skills and extract unique skills
  const parsedSkills = JSON.parse(skills); // Parse the JSON string
  const uniqueSkills = [...new Set(parsedSkills.map(skill => skill.skill))]; // Extract unique skills

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="p-10 max-w-5xl mx-auto">
        <div className="flex items-start mb-8">
          <img
            src={profile_picture || profilePic}
            alt={`${full_name}'s profile`}
            className="w-32 h-32 object-cover rounded-full border-4 border-blue-600 shadow-lg"
          />
          <div className="ml-6">
            <h2 className="text-4xl font-normal text-blue-800 flex items-center">
              {full_name}
            </h2>
            <p className="text-xl text-blue-700 flex items-center mt-2">
             {verifed && <FaCheckCircle className="w-5 mr-1 h-5 text-green-500" />}
              {professional_title &&<span className="flex items-center">{professional_title}</span>}
            </p>
            <div className="flex items-center mt-4">
              {is_active ? <p className="text-lg text-blue-700 mr-4">
                <span className="text-green-700">Available</span> for hire
              </p>: <p className="text-lg text-blue-700 mr-4">
                <span className="text-red-700">Not Available</span> for hire
              </p>
              }

              {is_active &&<button className="bg-green-500 text-white py-2 px-4 rounded-lg">
                Hire {full_name || "John Doe"}
              </button>
              }

            </div>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="text-2xl font-normal text-blue-800 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {uniqueSkills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-300 text-blue-900 text-lg px-3 py-1 rounded-full shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {prev_work_experience && prev_work_experience.lenght > 0 &&
         <section className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">Work Experience</h3>
          <div className="relative pl-8 border-l-2 border-blue-400">
            { prev_work_experience.map((experience, index) => (
              <div key={index} className="mb-6 relative">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{index + 1}</span>
                </div>
                <div className="ml-4">
                  <p className="text-base text-blue-800 mt-2">{experience}</p>
                </div>
              </div>
            ))}
          </div>
        </section>}

        <section className="mb-8">
          <h3 className="text-2xl font-normal text-blue-800 mb-4">Portfolio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.map((project, index) => (
              <div
                key={index}
                className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
              >
                <img
                  src={project.imageUrl || "https://via.placeholder.com/300"}
                  alt={project.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-semibold text-blue-800">
                  {project.title}
                </h4>
                <p className="text-base text-blue-700 mt-2">
                  {project.description}
                </p>
                <a
                  href={project.link}
                  className="text-blue-600 mt-2 inline-block underline hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project
                </a>
              </div>
            ))}
          </div>
        </section>

        {certifications && certifications.lenght > 0 &&
         <section className="mb-8">
       <h3 className="text-2xl font-normal text-blue-800 mb-4">Certifications</h3>
          <ul className="list-disc list-inside">
            {certifications.map((certification, index) => (
              <li key={index} className="text-lg text-blue-700">
                <a
                  href={certification.link || "#"}
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>{certification.name}</strong>
                </a>{" "}
                - {certification.organization} ({certification.date})
              </li>
            ))}
          </ul>
        </section>
}
        <section>
          <h3 className="text-2xl font-normal text-blue-800 mb-4">
            Preferred Working Style: <span className="text-lg text-blue-700">{preferred_working_hours}</span>

          </h3>
        </section>
      </div>
    </div>
  );
};

export default FreelancerDetailPage;
