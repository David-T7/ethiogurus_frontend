import React from 'react';
import { Link } from 'react-router-dom';

const TestDetailPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 bg-brand-blue text-white">
          <h2 className="text-3xl font-bold">JavaScript Fundamentals Test</h2>
          <p className="mt-4">
            Test your knowledge of JavaScript basics, including syntax, data types, and control structures.
          </p>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Test Instructions</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Time Limit: 60 minutes</li>
            <li>Number of Questions: 25</li>
            <li>Passing Score: 70%</li>
            <li>You cannot pause the test once started.</li>
            <li>Make sure you have a stable internet connection.</li>
          </ul>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Test Rules</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Do not close the browser window during the test.</li>
              <li>Cheating is strictly prohibited and will result in disqualification.</li>
              <li>All questions are mandatory.</li>
              <li>Your score will be displayed at the end of the test.</li>
            </ul>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              to="/test/1/start" // Replace with the actual route for starting the test
              className="bg-brand-green text-white font-semibold py-3 px-8 rounded-lg hover:bg-brand-dark-green transition-colors duration-300"
            >
              Start Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDetailPage;
