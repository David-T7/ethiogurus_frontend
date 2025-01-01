import React from "react";
import {
  FaFileAlt,
  FaCode,
  FaVideo,
} from "react-icons/fa"; // Updated icons for filtering steps
import ethiopianCoder from "../images/software-developer.jpg"; // Make sure to use the correct path

const AboutUs = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Top Section with Image and Overlay Text */}
      <div className="relative">
        <img
          src={ethiopianCoder}
          alt="Ethiopian coder"
          layout="responsive"
          width={1920}
          height={1080}
          className="object-cover w-full h-80 lg:h-96"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center">
          <div className="text-white text-center p-6">
            <p className="text-xl lg:text-3xl font-light mt-2">
              We connect top talent in Ethiopia with top organizations.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-6">
        {/* Freelancer Filtering Steps */}
        <section className="mb-16 mt-10">
          <h2 className="text-4xl font-normal text-center text-brand-blue mb-10 flex items-center justify-center gap-3">
            Freelancer Filtering Process
          </h2>
          <div className="text-center mb-8">
            <p className="text-lg text-brand-gray-dark mx-auto max-w-2xl">
              Our rigorous screening process ensures we connect only the best
              freelancers with top organizations. Here are the steps:
            </p>
          </div>
          <div className="flex justify-center items-center flex-wrap gap-8 relative">
            {/* Resume Filtering */}
            <div className="relative group flex flex-col items-center text-center transform hover:scale-105 transition-transform">
              <div className="relative z-10 p-4 rounded-full bg-indigo-200 shadow-lg flex items-center justify-center">
                <FaFileAlt className="text-4xl text-brand-blue" />
              </div>
              <h3 className="text-xl font-normal text-brand-blue mt-4">
                Resume Filtering
              </h3>
              <p className="text-base text-brand-gray-dark mt-2 max-w-xs">
                We evaluate resumes to shortlist candidates with relevant skills
                and experience.
              </p>
            </div>

            {/* Depth Skill Assessment */}
            <div className="relative group flex flex-col items-center text-center transform hover:scale-105 transition-transform">
              <div className="relative z-10 p-4 rounded-full bg-orange-200 shadow-lg flex items-center justify-center">
                <FaCode className="text-4xl text-brand-yellow" />
              </div>
              <h3 className="text-xl font-normal text-brand-blue mt-4">
                Depth Skill Assessment
              </h3>
              <p className="text-base text-brand-gray-dark mt-2 max-w-xs">
                Freelancers undergo rigorous testing to prove their expertise in
                specific skills.
              </p>
            </div>

            {/* Live Interview Assessment */}
            <div className="relative group flex flex-col items-center text-center transform hover:scale-105 transition-transform">
              <div className="relative z-10 p-4 rounded-full bg-teal-200 shadow-lg flex items-center justify-center">
                <FaVideo className="text-4xl text-brand-green" />
              </div>
              <h3 className="text-xl font-normal text-brand-blue mt-4">
                Live Interview Assessment
              </h3>
              <p className="text-base text-brand-gray-dark mt-2 max-w-xs">
                Candidates participate in live interviews to demonstrate their
                communication and problem-solving skills.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
