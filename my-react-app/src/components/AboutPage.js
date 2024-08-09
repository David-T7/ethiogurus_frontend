import React from "react";
import {
  FaHandshake,
  FaLightbulb,
  FaShieldAlt,
  FaStar,
  FaBullseye,
  FaRocket,
} from "react-icons/fa"; // Import icons
import ethiopianCoder from "../images/software-developer.jpg"; // Make sure to use the correct path

const AboutUs = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Top Section with Image and Overlay Text */}
      <div className="relative">
        <img
          src={ethiopianCoder}
          alt="Ethiopian coder"
          className="object-cover w-full h-80 lg:h-96"
        />
        <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center">
          <div className="text-white text-center p-6">
            <p className="text-xl lg:text-3xl mt-2">
              We connect top talent in Ethiopia with top organizations.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-6">
        {/* Mission and Vision Sections Side by Side */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Mission Statement Section */}
          <section className="flex-1 bg-brand-light-blue p-8 rounded-lg relative flex flex-col items-center justify-center">
            <div className="absolute inset-0 -z-10 opacity-20"></div>
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
                At EthioGuru, we are dedicated to connecting world-class talent
                with businesses to drive innovation and success. Our mission is
                to provide exceptional professionals who can tackle the most
                challenging projects and contribute to the growth and excellence
                of our clients.
              </p>
            </div>
          </section>

          {/* Vision Statement Section */}
          <section className="flex-1 bg-brand-gray-light p-8 rounded-lg relative flex flex-col items-center justify-center">
            <div className="absolute inset-0 -z-10 opacity-20">
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
                Our vision is to be at the forefront of the evolving landscape
                of work, connecting innovative talent with forward-thinking
                companies. We aim to drive progress and create opportunities
                that shape the future of industries and professions.
              </p>
            </div>
          </section>
        </div>

        {/* Values Section */}
        <section className="mb-16 mt-10">
          <h2 className="text-4xl font-bold text-center text-brand-blue mb-10 flex items-center justify-center gap-3">
            <FaShieldAlt className="text-3xl" />
            Our Values
          </h2>
          <div className="text-center mb-8">
            <p className="text-lg text-brand-gray-dark mx-auto max-w-2xl">
              Our core values guide us in every interaction, ensuring that we
              deliver exceptional results for our clients.
            </p>
          </div>
          <div className="flex justify-center items-center flex-wrap gap-8 relative">
            {/* Connecting Lines */}

            {/* Integrity */}
            <div className="relative group flex flex-col items-center text-center transform hover:scale-105 transition-transform">
              <div className="relative z-10 p-4 rounded-full bg-indigo-200 shadow-lg flex items-center justify-center">
                <FaHandshake className="text-4xl text-brand-blue" />
              </div>
              <h3 className="text-xl font-semibold text-brand-blue mt-4">
                Integrity
              </h3>
              <p className="text-base text-brand-gray-dark mt-2 max-w-xs">
                We uphold the highest standards of honesty and transparency in
                all our interactions.
              </p>
            </div>

            {/* Innovation */}
            <div className="relative group flex flex-col items-center text-center transform hover:scale-105 transition-transform">
              <div className="relative z-10 p-4 rounded-full bg-orange-200 shadow-lg flex items-center justify-center">
                <FaLightbulb className="text-4xl text-brand-yellow" />
              </div>
              <h3 className="text-xl font-semibold text-brand-blue mt-4">
                Innovation
              </h3>
              <p className="text-base text-brand-gray-dark mt-2 max-w-xs">
                We embrace creativity and seek out new ways to solve problems
                and drive progress.
              </p>
            </div>

            {/* Excellence */}
            <div className="relative group flex flex-col items-center text-center transform hover:scale-105 transition-transform">
              <div className="relative z-10 p-4 rounded-full bg-teal-200 shadow-lg flex items-center justify-center">
                <FaStar className="text-4xl text-brand-green" />
              </div>
              <h3 className="text-xl font-semibold text-brand-blue mt-4">
                Excellence
              </h3>
              <p className="text-base text-brand-gray-dark mt-2 max-w-xs">
                We are committed to delivering exceptional quality and exceeding
                our clients' expectations.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
