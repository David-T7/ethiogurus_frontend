import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import googleLogo from '../images/google-logo.png';
import { AuthContext } from './AuthContext'; // Update this path according to your project structure

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const userData = await login(email, password); // Assume login returns user data
      console.log("use data is ",userData)
      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (userData.role === 'freelancer') {
        if(userData.assessment){
          navigate('/assessments')
        }
        else{
        navigate('/home');
        }
      } else if (userData.role === 'interviewer') {
        navigate('/welcome');
      } else if (userData.role === 'client') {
        navigate('/dashboard');
      } else if (userData.role === 'dispute-manager') {
        navigate('/latest-disputes');
      } else {
        navigate('/dashboard'); // Default dashboard for other roles
      }

    } catch (err) {
      if (err.response && err.response.data) {
        // Display specific error message from backend
        setError(err.response.data.detail || 'An error occurred. Please try again.');
      } else {
        // Display a generic error message
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-md mx-auto">
        <h2 className="text-3xl font-normal text-brand-blue mb-6">
          Log In
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <label htmlFor="email" className="block text-lg font-normal text-brand-blue mb-2">
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-lg font-normal text-brand-blue mb-2">
              <FaLock className="inline mr-2" />
              Password
            </label>
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
            >
              {!passwordVisible ? <FaEyeSlash /> : <FaEye />}
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
