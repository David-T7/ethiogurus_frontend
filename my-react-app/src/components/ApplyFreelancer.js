import React, { useState } from 'react';
import { FaFileAlt, FaUser, FaEnvelope, FaPhone, FaPencilAlt } from 'react-icons/fa'; // Import icons

const ApplyAsFreelancer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Application submitted successfully!');
  };

  return (
    <div className="container mx-auto py-12 px-6">
      {/* Introduction Section */}
      <section className="text-center mb-12">
        <h2 className="text-4xl font-semibold text-brand-blue mb-4">
          Apply as a Freelancer
        </h2>
        <p className="text-lg text-brand-gray-dark">
          Join our network of top freelancers by filling out the application form below. 
          We are looking for talented professionals who are passionate about their work and ready to take on exciting projects.
        </p>
      </section>

      {/* Application Form */}
      <section className="bg-gray-100 p-8 rounded-lg max-w-xl mx-auto">
        <h3 className="text-3xl font-semibold text-brand-blue mb-6">Application Form</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-lg font-medium text-brand-blue">
              <FaUser className="inline mr-2" />
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border rounded-lg"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-lg font-medium text-brand-blue">
              <FaEnvelope className="inline mr-2" />
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border rounded-lg"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-lg font-medium text-brand-blue">
              <FaPhone className="inline mr-2" />
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 border rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="skills" className="text-lg font-medium text-brand-blue">
              <FaPencilAlt className="inline mr-2" />
              Skills
            </label>
            <textarea
              id="skills"
              name="skills"
              rows="4"
              placeholder="Your Skills and Experience"
              value={formData.skills}
              onChange={handleChange}
              className="p-3 border rounded-lg"
              required
            ></textarea>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="resume" className="text-lg font-medium text-brand-blue">
              <FaFileAlt className="inline mr-2" />
              Resume
            </label>
            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="p-3 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
          >
            Submit Application
          </button>
        </form>
      </section>
    </div>
  );
};

export default ApplyAsFreelancer;
