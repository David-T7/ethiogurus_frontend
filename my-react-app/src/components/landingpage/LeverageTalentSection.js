import React from 'react';
import { FaCode, FaPaintBrush, FaChartLine, FaTasks, FaProductHunt, FaBullhorn } from 'react-icons/fa';

const LeverageTalentSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <h2 className="text-3xl font-semibold mb-6 text-white text-center">
        Leverage World-Class Talent
      </h2>
      <p className="text-lg mb-8 text-center text-white">
        We are the largest, globally-distributed network of top business,
        design, and technology talent, ready to tackle your most important
        initiatives.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg group transition duration-300 hover:bg-brand-blue">
          <FaCode className="text-4xl text-brand-blue mb-4 group-hover:text-white" />
          <h3 className="text-xl font-semibold mb-2 text-brand-blue group-hover:text-white">
            Developers
          </h3>
          <p className="text-brand-gray-dark group-hover:text-white">
            Seasoned software engineers, coders, and architects with expertise
            across hundreds of technologies.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg group transition duration-300 hover:bg-brand-blue">
          <FaPaintBrush className="text-4xl text-brand-blue mb-4 group-hover:text-white" />
          <h3 className="text-xl font-semibold mb-2 text-brand-blue group-hover:text-white">
            Designers
          </h3>
          <p className="text-brand-gray-dark group-hover:text-white">
            Expert UI, UX, Visual, and Interaction designers as well as a wide
            range of illustrators, animators, and more.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg group transition duration-300 hover:bg-brand-blue">
          <FaChartLine className="text-4xl text-brand-blue mb-4 group-hover:text-white" />
          <h3 className="text-xl font-semibold mb-2 text-brand-blue group-hover:text-white">
            Finance Experts
          </h3>
          <p className="text-brand-gray-dark group-hover:text-white">
            Experts in financial modeling & valuation, startup funding,
            interim CFO work, and market sizing.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg group transition duration-300 hover:bg-brand-blue">
          <FaTasks className="text-4xl text-brand-blue mb-4 group-hover:text-white" />
          <h3 className="text-xl font-semibold mb-2 text-brand-blue group-hover:text-white">
            Project Managers
          </h3>
          <p className="text-brand-gray-dark group-hover:text-white">
            Digital and technical project managers, scrum masters, and more
            with expertise in numerous PM tools, frameworks, and styles.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg group transition duration-300 hover:bg-brand-blue">
          <FaProductHunt className="text-4xl text-brand-blue mb-4 group-hover:text-white" />
          <h3 className="text-xl font-semibold mb-2 text-brand-blue group-hover:text-white">
            Product Managers
          </h3>
          <p className="text-brand-gray-dark group-hover:text-white">
            Digital product managers, scrum product owners with expertise in
            numerous industries like banking, healthcare, ecommerce, and more.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg group transition duration-300 hover:bg-brand-blue">
          <FaBullhorn className="text-4xl text-brand-blue mb-4 group-hover:text-white" />
          <h3 className="text-xl font-semibold mb-2 text-brand-blue group-hover:text-white">
            Marketing Experts
          </h3>
          <p className="text-brand-gray-dark group-hover:text-white">
            Experts in digital marketing, growth marketing, content creation,
            market research, brand strategy execution, social media marketing,
            and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeverageTalentSection;
