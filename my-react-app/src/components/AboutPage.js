import React from 'react';
import { FaHandshake, FaLightbulb, FaShieldAlt  , FaStar, FaBullseye, FaRocket } from 'react-icons/fa'; // Import icons

const AboutUs = () => {
  return (
    <div className="container mx-auto py-12 px-6">
      {/* Mission and Vision Sections Side by Side */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Mission Statement Section */}
        <section className="flex-1 bg-brand-light-blue p-8 rounded-lg shadow-lg relative flex flex-col items-center justify-center">
          <div className="absolute inset-0 -z-10 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill="#e0f7fa"/>
              <circle cx="30" cy="30" r="25" fill="#80deea"/>
              <circle cx="70" cy="70" r="30" fill="#4fc3f7"/>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl text-brand-blue">
                <FaBullseye />
              </div>
              <h2 className="text-4xl font-semibold text-brand-blue">
              Mission
              </h2>
            </div>
            <h3 className="text-2xl font-bold text-brand-blue mb-4">
              Empowering Talent and Innovation
            </h3>
            <p className="text-lg text-brand-gray-dark mx-auto max-w-3xl">
              At EthioGuru, we are dedicated to connecting world-class talent with businesses
              to drive innovation and success. Our mission is to provide exceptional
              professionals who can tackle the most challenging projects and contribute to
              the growth and excellence of our clients.
            </p>
          </div>
        </section>

        {/* Vision Statement Section */}
        <section className="flex-1 bg-brand-gray-light p-8 rounded-lg shadow-lg relative flex flex-col items-center justify-center">
          <div className="absolute inset-0 -z-10 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill="#f1f8e9"/>
              <circle cx="30" cy="30" r="25" fill="#dcedc8"/>
              <circle cx="70" cy="70" r="30" fill="#c5e1a5"/>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl text-brand-blue">
                <FaRocket />
              </div>
              <h2 className="text-4xl font-semibold text-brand-blue">
                Vision
              </h2>
            </div>
            <h3 className="text-2xl font-bold text-brand-blue mb-4">
              Shaping the Future of Work
            </h3>
            <p className="text-lg text-brand-gray-dark mx-auto max-w-3xl">
              Our vision is to be at the forefront of the evolving landscape of work, connecting innovative talent with forward-thinking companies. We aim to drive progress and create opportunities that shape the future of industries and professions.
            </p>
          </div>
        </section>
      </div>

      {/* Values Section */}
      <section className="mb-16 mt-5">
      <h2 className="text-4xl font-semibold text-center text-brand-blue mb-8 flex items-center justify-center gap-4">
            <FaShieldAlt  className="text-3xl" /> {/* Updated icon here */}
            Values
          </h2>
        <div className="text-center mb-8">
          <p className="text-lg text-brand-gray-dark mx-auto max-w-2xl">
            Our core values are the foundation of our approach. They guide us in every interaction and decision, ensuring that we deliver the best results for our clients.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform flex flex-col items-center">
            <div className="text-4xl mb-4 text-brand-blue">
              <FaHandshake />
            </div>
            <h3 className="text-xl font-semibold text-brand-blue mb-4">Integrity</h3>
            <p className="text-lg text-brand-gray-dark">
              We uphold the highest standards of honesty and transparency in all our interactions and deliverables.
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform flex flex-col items-center">
            <div className="text-4xl mb-4 text-brand-yellow">
              <FaLightbulb />
            </div>
            <h3 className="text-xl font-semibold text-brand-blue mb-4">Innovation</h3>
            <p className="text-lg text-brand-gray-dark">
              We embrace creativity and seek out new ways to solve problems and drive progress.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform flex flex-col items-center">
            <div className="text-4xl mb-4 text-brand-green">
              <FaStar />
            </div>
            <h3 className="text-xl font-semibold text-brand-blue mb-4">Excellence</h3>
            <p className="text-lg text-brand-gray-dark">
              We are committed to delivering exceptional quality and exceeding our clients' expectations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
