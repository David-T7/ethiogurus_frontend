import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      // Send POST request to create dispute
      const response = await axios.post('http://127.0.0.1:8000/password-reset-request/', 
        {
          email:email
        }
      );

      setMessage(response.data.message)
    }
    catch(err){
      if (err.response && err.response.data) {
        // Display backend validation errors
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Failed to send reset link. Please try again.');
      }
    }    
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg  max-w-md mx-auto">
        <h2 className="text-2xl font-normal text-brand-blue mb-6">
          Want to change Your Password?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Enter the email address associated with your account, and we will send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="block text-lg font-normal text-brand-blue mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Submit
          </button>
          {message && (
          <div className="text-green-500 text-center mt-4 text-md">
            {message}
          </div>
        )}
        {error && (
    <div className="text-red-500 text-center mt-4 text-md">
      {typeof error === "string" && error.length<=100 ? error : "An error occurred. Please try again."}
    </div>
  )}
        </form>
      </section>
    </div>
  );
};

export default ForgotPasswordPage;
