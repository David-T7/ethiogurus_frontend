import React from 'react';
import { FaCode, FaPaintBrush, FaChartLine, FaTasks, FaProductHunt, FaBullhorn } from 'react-icons/fa';

const LeverageTalentSection = () => {
  const sections = [
    {
      icon: <FaCode className="text-4xl text-brand-blue mb-4 group-hover:text-white" />,
      title: "Developers",
      description: "Seasoned software engineers, coders, and architects with expertise across hundreds of technologies.",
      comingSoon: false,
    },
    {
      icon: <FaPaintBrush className="text-4xl text-brand-blue mb-4 group-hover:text-white" />,
      title: "Designers",
      description: "Expert UI, UX, Visual, and Interaction designers as well as a wide range of illustrators, animators, and more.",
      comingSoon: true,
    },
    {
      icon: <FaChartLine className="text-4xl text-brand-blue mb-4 group-hover:text-white" />,
      title: "Finance Experts",
      description: "Professionals with diverse expertise to support your financial needs.",
      comingSoon: true,
    },
    {
      icon: <FaTasks className="text-4xl text-brand-blue mb-4 group-hover:text-white" />,
      title: "Project Managers",
      description: "Digital and technical project managers, scrum masters, and more with expertise in numerous PM tools, frameworks, and styles.",
      comingSoon: true,
    },
    {
      icon: <FaProductHunt className="text-4xl text-brand-blue mb-4 group-hover:text-white" />,
      title: "Product Managers",
      description: "Digital product managers, scrum product owners with expertise in numerous industries like banking, healthcare, ecommerce, and more.",
      comingSoon: true,
    },
    {
      icon: <FaBullhorn className="text-4xl text-brand-blue mb-4 group-hover:text-white" />,
      title: "Marketing Experts",
      description: "Experts in digital marketing, growth marketing, content creation, market research, brand strategy execution, social media marketing, and more.",
      comingSoon: true,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <h2 className="text-3xl font-normal mb-6 text-white text-center">
        Leverage World-Class Talent
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div key={index} className="relative bg-white p-6 rounded-lg shadow-lg group transition duration-300 hover:bg-brand-blue">
            {section.comingSoon && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Coming Soon
              </div>
            )}
            {section.icon}
            <h3 className="text-xl font-semibold mb-2 text-brand-blue group-hover:text-white">
              {section.title}
            </h3>
            <p className="text-brand-gray-dark group-hover:text-white">
              {section.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeverageTalentSection;
