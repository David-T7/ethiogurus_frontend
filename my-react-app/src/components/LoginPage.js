import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Make sure to have react-router-dom installed

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      <section className="bg-gray-100 p-8 rounded-lg  max-w-md mx-auto">
        <h2 className="text-3xl font-semibold text-brand-blue mb-6">
          Log In
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-brand-blue mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-brand-blue mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
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
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
