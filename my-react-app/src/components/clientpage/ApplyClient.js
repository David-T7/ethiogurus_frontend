import React, { useState } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';

const HireATalent = () => {
  const [selectedDuration, setSelectedDuration] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const handleDurationChange = (e) => {
    setSelectedDuration(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let nextPath = '/hire-talent/time-commitment'; // Default path for Layout
    // Check current route to determine the next path
    if (location.pathname.startsWith('/create-project')) {
      nextPath = '/create-project/time-commitment'; // Update this path if needed
    }
    // Navigate to the determined next path
    navigate(nextPath);
  };
  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-lg mx-auto">
        <h2 className="text-3xl font-normal text-brand-blue mb-6">
          Thanks for your interest in hiring through EthioGurus!
        </h2>
        <p className="text-lg text-brand-gray-dark mb-6">
          Before we get started, we'd like to ask a few questions to better understand your business needs.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <fieldset>
            <legend className="text-xl font-normal text-brand-blue mb-4">
            How long do you need the developer?
            </legend>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="duration"
                  value="Less than 1 week"
                  checked={selectedDuration === 'Less than 1 week'}
                  onChange={handleDurationChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  Less than 1 week
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="duration"
                  value="1 to 4 weeks"
                  checked={selectedDuration === '1 to 4 weeks'}
                  onChange={handleDurationChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  1 to 4 weeks
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="duration"
                  value="1 to 3 months"
                  checked={selectedDuration === '1 to 3 months'}
                  onChange={handleDurationChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  1 to 3 months
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="duration"
                  value="3 to 6 months"
                  checked={selectedDuration === '3 to 6 months'}
                  onChange={handleDurationChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  3 to 6 months
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="duration"
                  value="Longer than 6 months"
                  checked={selectedDuration === 'Longer than 6 months'}
                  onChange={handleDurationChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  Longer than 6 months
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="duration"
                  value="I'll decide later"
                  checked={selectedDuration === "I'll decide later"}
                  onChange={handleDurationChange}
                  className="form-radio text-brand-blue"
                />
                <span className="text-lg text-brand-gray-dark">
                  I'll decide later
                </span>
              </label>
            </div>
          </fieldset>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Get Started
          </button>
        </form>
      </section>
    </div>
  );
};

export default HireATalent;
