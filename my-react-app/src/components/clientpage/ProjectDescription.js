import React, { useState } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';

const ProjectDescriptionPage = () => {
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    let nextPath = '/hire-talent/talent-list'; // Default path for Layout
    // Check current route to determine the next path
    if (location.pathname.startsWith('/create-project')) {
      nextPath = '/create-project/talent-list'; // Update this path if needed
    }
    // Navigate to the determined next path
    navigate(nextPath);
  };

  const handleBack = () => {
    // Navigate back to the previous step
    navigate(-1); // Go back one step in the navigation history
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-lg mx-auto">
        <h2 className="text-3xl font-normal text-brand-blue mb-6">
          Project Description
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="description" className="block text-lg font-normal text-brand-blue mb-2">
              <FaInfoCircle className="inline mr-2" />
              Say something about the project
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
            />
          </div>
          <div className="border-t border-gray-300 pt-6">
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-300 text-black py-3 px-6 rounded-lg hover:bg-gray-400 transition text-lg"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-brand-blue text-white py-3 px-6 rounded-lg hover:bg-brand-dark-blue transition text-lg"
              >
                Connect with Talent
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProjectDescriptionPage;
