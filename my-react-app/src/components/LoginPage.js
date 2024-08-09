import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure to have react-router-dom installed
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    // Handle login logic here (e.g., API call)
    // For now, just logging the values
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Clear error if everything is fine
    setError('');
    
    // Redirect or show success message here
    alert('Login successful!');
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-md mx-auto">
        <h2 className="text-3xl font-semibold text-brand-blue mb-6">
          Log In
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <label htmlFor="email" className="block text-lg font-medium text-brand-blue mb-2">
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-3 border border-brand-blue rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-brand-blue"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-lg font-medium text-brand-blue mb-2">
              <FaLock className="inline mr-2" />
              Password
            </label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="p-3 border border-brand-blue rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-brand-blue"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Log In
          </button>
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-brand-blue hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="mt-3 text-center">
            <p className="text-lg text-gray-700 mb-2">
              No account? Join Ethiogurus as a{' '}
              <Link to="/apply-freelancer" className="text-brand-blue hover:underline">
                freelancer
              </Link>{' '}
              or{' '}
              <Link to="/hire-talent" className="text-brand-blue hover:underline">
               company
              </Link>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
