import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure to have react-router-dom installed
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

// Update this path to where you place your Google logo image
import googleLogo from '../images/google-logo.png'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State for remember me checkbox

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
    console.log('Remember Me:', rememberMe);
    
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 border-gray-300 text-brand-blue focus:ring-brand-blue rounded"
              />
              <label htmlFor="rememberMe" className="text-gray-700">
                Remember Me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-brand-blue hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
          >
            Log In
          </button>
          <div className="flex items-center justify-center mt-4 mb-6">
            <div className="w-full border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg w-full text-gray-700 hover:bg-gray-200 transition-colors duration-300"
          >
            <img src={googleLogo} alt="Google logo" className="w-5 h-5 object-contain" />
            Log In with Google
          </button>
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
