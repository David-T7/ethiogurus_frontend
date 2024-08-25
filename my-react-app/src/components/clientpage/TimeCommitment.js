import React, { useState } from 'react';
import { useNavigate ,  useLocation } from 'react-router-dom';

const TimeCommitment = () => {
  const [selectedCommitment, setSelectedCommitment] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleCommitmentChange = (e) => {
    setSelectedCommitment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("timeCommitment",selectedCommitment)
    let nextPath = '/hire-talent/skills'; // Default path for Layout
    // Check current route to determine the next path
    if (location.pathname.startsWith('/create-project')) {
      nextPath = '/create-project/skills'; // Update this path if needed
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
          What level of time commitment will you require from the developer?
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <fieldset>
            <legend className="text-xl font-normal text-brand-blue mb-4">
              Please select the time commitment level
            </legend>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="commitment"
                  value="Full time (40 or more hrs/week)"
                  checked={selectedCommitment === 'Full time (40 or more hrs/week)'}
                  onChange={handleCommitmentChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  Full time (40 or more hrs/week)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="commitment"
                  value="Part time (Less than 40 hrs/week)"
                  checked={selectedCommitment === 'Part time (Less than 40 hrs/week)'}
                  onChange={handleCommitmentChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  Part time (Less than 40 hrs/week)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="commitment"
                  value="Hourly"
                  checked={selectedCommitment === 'Hourly'}
                  onChange={handleCommitmentChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  Hourly
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="commitment"
                  value="I'll decide later"
                  checked={selectedCommitment === "I'll decide later"}
                  onChange={handleCommitmentChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  I'll decide later
                </span>
              </label>
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
              disabled={!selectedCommitment} // Disable if nothing is selected
              className={`py-3 px-6 rounded-lg text-lg transition ${
                selectedCommitment
                  ? 'bg-brand-blue text-white hover:bg-brand-dark-blue'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default TimeCommitment;
