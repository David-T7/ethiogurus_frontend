import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Basic validation
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    // Handle password recovery logic here (e.g., API call)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage('We have sent password reset instructions to your email. Please check your inbox (and spam folder) for further instructions.');
    } catch (err) {
      setError('Failed to send password reset instructions. Please try again.');
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg  max-w-md mx-auto">
        <h2 className="text-3xl font-semibold text-brand-blue mb-6">
          Forgot Your Password?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Enter the email address associated with your account, and we will send you a link to reset your password.
        </p>
        {message && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-brand-blue mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
};

export default ForgotPasswordPage;
