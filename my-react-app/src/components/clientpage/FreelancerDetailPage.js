import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const FreelancerDetailPage = () => {
  const freelancerData = {
    profilePicture: "https://via.placeholder.com/150",
    name: "John Doe",
    title: "Senior Full Stack Developer",
    skills: ["JavaScript", "React", "Node.js", "Python", "Django"],
    preferredWorkingStyle: "Part Time",
    workExperience: [
      {
        company: "Tech Corp",
        role: "Senior Developer",
        startDate: "Jan 2020",
        endDate: "Present",
        description:
          "Developed and maintained web applications using React and Node.js.",
      },
      {
        company: "Design Studio",
        role: "Frontend Developer",
        startDate: "Mar 2018",
        endDate: "Dec 2019",
        description:
          "Worked on UI/UX design and frontend development using React and CSS.",
      },
      {
        company: "Web Solutions Inc.",
        role: "Backend Developer",
        startDate: "Jan 2016",
        endDate: "Feb 2018",
        description:
          "Built and managed backend services using Django and PostgreSQL.",
      },
    ],
    portfolio: [
      {
        title: "E-commerce Website",
        description:
          "Developed a full-featured e-commerce platform with payment integration.",
        link: "https://example.com",
        imageUrl: "https://via.placeholder.com/300",
      },
      {
        title: "Portfolio Website",
        description: "Designed and developed a personal portfolio website.",
        link: "https://example.com",
        imageUrl: "https://via.placeholder.com/300",
      },
    ],
    certifications: [
      {
        name: "Certified JavaScript Developer",
        organization: "JavaScript Institute",
        date: "Apr 2021",
        link: "https://javascript-institute.org/certifications/certified-javascript-developer", // Example link
      },
      {
        name: "AWS Certified Solutions Architect",
        organization: "Amazon Web Services",
        date: "Sep 2020",
        link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/", // Example link
      },
    ],
  };

  const {
    profilePicture,
    name,
    title,
    skills,
    workExperience,
    portfolio,
    certifications,
    preferredWorkingStyle,
  } = freelancerData;

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="p-10 max-w-5xl mx-auto">
        <div className="flex items-start mb-8">
          <img
            src={profilePicture}
            alt={`${name}'s profile`}
            className="w-32 h-32 object-cover rounded-full border-4 border-blue-600 shadow-lg"
          />
          <div className="ml-6">
            <h2 className="text-4xl font-semibold text-blue-800 flex items-center">
              {name}
            </h2>
            <p className="text-xl text-blue-700 flex items-center mt-2">
              <FaCheckCircle className="w-5 mr-1 h-5 text-green-500" />
              <span className="flex items-center">{title}</span>
            </p>
            <div className="flex items-center mt-4">
              <p className="text-lg text-blue-700 mr-4">
                <span className="text-green-700">Available</span> for hire
              </p>
              <button className="bg-green-500 text-white py-2 px-4 rounded-lg">
                Hire {name}
              </button>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-300 text-blue-900 text-lg px-3 py-1 rounded-full shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">
            Work Experience
          </h3>
          <div className="relative pl-8 border-l-2 border-blue-400">
            {workExperience.map((experience, index) => (
              <div key={index} className="mb-6 relative">
                <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {index + 1}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-blue-800">
                    {experience.role}
                  </h4>
                  <p className="text-lg text-blue-700">{experience.company}</p>
                  <p className="text-sm text-blue-600">
                    {experience.startDate} - {experience.endDate}
                  </p>
                  <p className="text-base text-blue-800 mt-2">
                    {experience.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">
            Portfolio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.map((project, index) => (
              <div
                key={index}
                className="relative bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
              >
                <img
                  src={project.imageUrl}
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

        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">
            Certifications
          </h3>
          <ul className="list-disc list-inside">
            {certifications.map((certification, index) => (
              <li key={index} className="text-lg text-blue-700">
                <a
                  href={certification.link}
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

        <section>
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">
            Preferred Working Style
          </h3>
          <p className="text-lg text-blue-700">{preferredWorkingStyle}</p>
        </section>
      </div>
    </div>
  );
};

export default FreelancerDetailPage;
