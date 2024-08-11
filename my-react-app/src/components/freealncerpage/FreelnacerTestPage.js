import React from 'react';
import { Link } from 'react-router-dom';
import FreelancerProfileLayout from './FreelancerLayoutPage';
import { FaClock, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TestInfo = () => {
  return (
    <div className="bg-brand-blue p-8 rounded-lg shadow-lg text-white mb-10">
      <h2 className="text-3xl font-bold mb-6">Prepare for Your Test</h2>
      <p className="mb-4 text-lg">
        Congratulations on passing the resume screening! You’re one step closer to landing your dream job. Below are the tests that you need to complete based on the position you applied for.
      </p>
      <h3 className="text-xl font-semibold mb-4">Test Rules</h3>
      <ul className="list-disc list-inside pl-4 text-lg">
        <li>Ensure you have a stable internet connection.</li>
        <li>No external help is permitted during the test.</li>
        <li>Complete the test in one sitting, as you cannot pause it.</li>
        <li>Read each question carefully before answering.</li>
      </ul>
    </div>
  );
};

const TestCard = ({ test }) => {
  const navigate = useNavigate();

  const handleStartTest = (test) => {
    if (test.type === 'coding') {
      navigate(`/coding-test/${test.id}`);
    } else {
      navigate(`/test/${test.id}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-brand-blue">{test.title}</h3>
          <p className="flex items-center text-gray-600"><FaClock className="mr-2" /> Duration: {test.duration}</p>
        </div>
        <button
          onClick={() => handleStartTest(test)}
          className="flex items-center justify-center px-4 py-2 bg-brand-green text-white rounded-full hover:bg-brand-dark-green transition-colors duration-300"
        >
          Start <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};


const TestList = () => {
  const tests = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Test your understanding of basic JavaScript concepts.',
      status: 'Not Started',
      duration:'60 minutes',
      type: 'multiple-choice', // New property to indicate test type
    },
    {
      id: 2,
      title: 'ReactJS Intermediate',
      description: 'Assess your knowledge of ReactJS and its ecosystem.',
      status: 'In Progress',
      duration:'60 minutes',
      type: 'multiple-choice',
    },
    {
      id: 3,
      title: 'Advanced CSS Techniques',
      description: 'Demonstrate your skills in CSS by taking this advanced test.',
      status: 'Completed',
      duration:'120 minutes',
      type: 'multiple-choice',
    },
    {
      id: 4,
      title: 'Full Stack Web Application',
      description: 'Build a full stack web application using your preferred framework.',
      status: 'Not Started',
      duration:'90 minutes',
      type: 'coding', // New test type for coding challenges
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {tests.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  );
};

const TestsPage = () => {
  return (
    <FreelancerProfileLayout>
      <div className="container mx-auto px-4 py-10">
        <TestInfo />
        <TestList />
      </div>
    </FreelancerProfileLayout>
  );
};

export default TestsPage;
