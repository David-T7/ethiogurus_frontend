import React, { useState } from 'react';

const FinalizePage = () => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Your request has been submitted!');
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="bg-gray-100 p-8 rounded-lg  max-w-lg mx-auto">
        <h2 className="text-3xl font-semibold text-brand-blue mb-6">
          Success! Let's connect you with talent.
        </h2>
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
            <label htmlFor="companyName" className="block text-lg font-medium text-brand-blue mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="contactName" className="block text-lg font-medium text-brand-blue mb-2">
              Contact Name
            </label>
            <input
              type="text"
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter your contact name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-lg font-medium text-brand-blue mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+251 91 123 4567"
              className="p-3 border border-gray-300 rounded-lg w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Connect with Talent
          </button>
        </form>
      </section>
    </div>
  );
};

export default FinalizePage;
