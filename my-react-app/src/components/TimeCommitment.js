import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TimeCommitment = () => {
  const [selectedCommitment, setSelectedCommitment] = useState('');
  const navigate = useNavigate();

  const handleCommitmentChange = (e) => {
    setSelectedCommitment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to the next step
    navigate('/hire-talent/skiils'); // Change this to the actual path for the next step
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-lg mx-auto">
        <h2 className="text-3xl font-semibold text-brand-blue mb-6">
          What level of time commitment will you require from the developer?
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <fieldset>
            <legend className="text-xl font-medium text-brand-blue mb-4">
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
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Next
          </button>
        </form>
      </section>
    </div>
  );
};

export default TimeCommitment;
