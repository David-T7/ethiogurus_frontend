import React from "react";
import { Link } from "react-router-dom";
import { FaRegStar, FaCheckCircle, FaSyncAlt, FaUserPlus } from "react-icons/fa";
import LeverageTalentSection from "./LeverageTalentSection";
import TestimonialSection from "./TestimonialSection";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-brand-blue to-brand-gray-light p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white shadow-lg">
          Hire the Top Freelance Talent®
        </h1>
        <p className="text-lg mb-8 text-white shadow-md">
          EthioGuru is an exclusive network of Ethiopia's top freelance software
          developers, designers, marketing experts, finance experts, product
          managers, and project managers. Leading Ethiopian companies hire
          EthioGuru freelancers for their most crucial projects.
        </p>
        <div className="flex flex-col items-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl font-extrabold mb-6 text-white text-center">
            Why Choose EthioGuru?
          </h2>
          <div className="relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-green opacity-10 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
                <div className="flex items-center justify-center mb-4 text-brand-blue text-4xl">
                  <FaRegStar />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-brand-blue">
                  Top Talent
                </h3>
                <p className="text-brand-gray-dark">
                  Access a curated network of Ethiopia's most talented freelancers
                  in various fields.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
                <div className="flex items-center justify-center mb-4 text-brand-blue text-4xl">
                  <FaCheckCircle />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-brand-blue">
                  Quality Assurance
                </h3>
                <p className="text-brand-gray-dark">
                  We ensure that every freelancer meets our high standards of
                  quality and expertise.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
                <div className="flex items-center justify-center mb-4 text-brand-blue text-4xl">
                  <FaSyncAlt />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-brand-blue">
                  Seamless Process
                </h3>
                <p className="text-brand-gray-dark">
                  Our platform makes it easy to find, hire, and collaborate with
                  top freelancers.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link
              to="/apply-client"
              className="flex items-center justify-center bg-brand-green text-white px-6 py-3 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-green-600"
            >
              <FaUserPlus className="mr-2" /> Hire a Talent
            </Link>
          </div>
        </div>
      </div>

      {/* Leverage World-Class Talent Section */}
      <LeverageTalentSection />

     {/* Hiring Steps */}
     <div className="w-full max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-brand-blue">How It Works</h2>
        <div className="flex flex-col space-y-8">
          {[
            { number: 1, title: 'Define Your Needs', description: 'Clearly outline your project requirements and the type of talent you need.', color: 'bg-brand-blue', textColor: 'text-white' },
            { number: 2, title: 'Browse and Select', description: 'Browse through our curated list of freelancers and select the best fit for your project.', color: 'bg-brand-orange', textColor: 'text-white' },
            { number: 3, title: 'Start Your Project', description: 'Start collaborating with your chosen freelancer and track the progress of your project.', color: 'bg-brand-purple', textColor: 'text-white' },
            { number: 4, title: 'Review and Approve', description: 'Review the deliverables and approve the work once you are satisfied.', color: 'bg-brand-teal', textColor: 'text-white' },
          ].map((step) => (
            <div key={step.number} className="flex items-start space-x-4">
              <div 
                className={`w-12 h-12 flex items-center justify-center ${step.color} ${step.textColor} rounded-full font-bold text-xl transform transition-transform duration-300 hover:scale-110 hover:shadow-lg`}
              >
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-brand-blue">{step.title}</h3>
                <p className="text-white-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <TestimonialSection/>
    </div>
  );
};

export default LandingPage;