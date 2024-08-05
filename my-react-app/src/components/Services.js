import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const servicesData = [
  {
    title: 'Web Development',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue.js'],
  },
  {
    title: 'DevOps & Cloud Computing',
    skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
  },
  {
    title: 'UX/UI Designers',
    skills: ['Sketch', 'Figma', 'Adobe XD', 'InVision'],
  },
  {
    title: 'Programming Languages',
    skills: ['Python', 'Java', 'C++', 'Ruby', 'Go', 'Rust'],
  },
  {
    title: 'Software Development Roles & Collaboration Models',
    skills: ['Agile', 'Scrum', 'Kanban', 'Lean'],
  },
  {
    title: 'Quality Assurance & Testing',
    skills: ['Selenium', 'Jest', 'Mocha', 'Chai'],
  },
  {
    title: 'API Development & Integration',
    skills: ['REST', 'GraphQL', 'SOAP', 'Postman'],
  },
  {
    title: 'Blockchain Development',
    skills: ['Ethereum', 'Smart Contracts', 'Solidity'],
  },
  {
    title: 'Desktop Development',
    skills: ['Electron', '.NET', 'Qt'],
  },
  {
    title: 'AR/VR & Game Development',
    skills: ['Unity', 'Unreal Engine', 'Blender'],
  },
  {
    title: 'Mobile Development',
    skills: ['iOS', 'Android', 'Flutter', 'React Native'],
  },
  {
    title: 'Data Science & AI',
    skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas'],
  },
  {
    title: 'Database & Big Data Technologies',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Hadoop', 'Spark'],
  },
  {
    title: 'CMS Platforms',
    skills: ['WordPress', 'Drupal', 'Joomla'],
  },
  {
    title: 'E-commerce & CRM Platforms',
    skills: ['Shopify', 'Magento', 'Salesforce'],
  },
  {
    title: 'Visual & Brand Design',
    skills: ['Adobe Photoshop', 'Adobe Illustrator', 'CorelDRAW'],
  },
  {
    title: 'Product & Project Management',
    skills: ['Jira', 'Asana', 'Trello'],
  },
  {
    title: 'Finance & Business Consulting',
    skills: ['Financial Modeling', 'Valuation', 'Business Strategy'],
  },
  {
    title: 'Marketing',
    skills: ['SEO', 'Content Marketing', 'Social Media'],
  },
  {
    title: 'Trending Skills & Roles',
    skills: ['Machine Learning', 'Cybersecurity', 'IoT'],
  },
];

const Services = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
      <div className="container mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-center text-brand-blue mb-8">Our Services</h1>
        <p className="text-lg mb-12 text-center text-brand-gray-dark">
          At EthioGuru, we connect you with top professionals across various domains to help you achieve your business goals.
        </p>
        <div className="space-y-6">
          {servicesData.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{service.title}</h2>
                <button
                  className="text-2xl text-brand-blue"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedIndex === index ? <FaMinus /> : <FaPlus />}
                </button>
              </div>
              {expandedIndex === index && (
                <ul className="mt-4 space-y-2 pl-4 list-disc list-inside text-brand-gray-dark">
                  {service.skills.map((skill, skillIndex) => (
                    <li key={skillIndex} className="text-lg">
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
  );
};

export default Services;
