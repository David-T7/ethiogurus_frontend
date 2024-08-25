import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProjectBudgetEstimate = () => {
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleBudgetChange = (e) => {
    setBudget(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("projectBudget", budget);
    let nextPath = '/hire-talent/project-description'; // Default path for Layout
    // Check current route to determine the next path
    if (location.pathname.startsWith('/create-project')) {
      nextPath = '/create-project/project-description'; // Update this path if needed
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
          What is your estimated budget for the project?(Optional)
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <fieldset>
            <legend className="text-xl font-normal text-brand-blue mb-4">
              Please enter your project budget
            </legend>
            <div className="flex flex-col gap-4">
              <input
                type="number"
                name="budget"
                value={budget}
                onChange={handleBudgetChange}
                placeholder="Enter budget in Birr"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
              />
            </div>
          </fieldset>
          {/* Separator with creative design */}
          <div className="border-t border-gray-300 relative">
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-center">
              <span className="bg-gray-100 px-4 text-gray-500"></span>
            </div>
          </div>
          <div className="flex justify-between mt-0">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 text-black py-3 px-6 rounded-lg hover:bg-gray-400 transition text-lg"
            >
              Back
            </button>
            <button
              type="submit"
              className="py-3 px-6 rounded-lg text-lg transition bg-brand-blue text-white hover:bg-brand-dark-blue"
            >
              Next
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProjectBudgetEstimate;
