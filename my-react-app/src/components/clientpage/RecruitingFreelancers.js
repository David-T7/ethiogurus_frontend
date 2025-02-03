import React, { useState } from 'react';
import axios from 'axios';

const RecruitingFreelancers = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Create the payload with full name and email
    const data = {
      "full_name":fullName,
      "email":email,
    };

    try {
      // Replace 'YOUR_API_URL' with your backend API endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/user/sign-up/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Successfully submitted');
        // Handle response if needed
      } else {
        console.error('Error submitting data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg max-w-lg mx-auto">
        <h2 className="text-3xl font-normal text-brand-blue mb-6">
          We Are Currently Recruiting Freelancers!
        </h2>
        <p className="text-lg text-brand-gray-dark mb-6">
          Thank you for your interest in using EthioGurus. We are currently in the process of recruiting freelancers.
          Once we are ready, we will notify you so you can sign up and start working with us.
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"              required
            />
            <button type="submit" className="py-3 px-6 rounded-lg bg-brand-blue text-white hover:bg-brand-dark-blue">
              Remind Me
            </button>
          </form>
        ) : (
          <p className="text-lg text-brand-green mt-4">Thank you! We will notify you once recruitment is complete.</p>
        )}
      </section>
    </div>
  );
};

export default RecruitingFreelancers;
