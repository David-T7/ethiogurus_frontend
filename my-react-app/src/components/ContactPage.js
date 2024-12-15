import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaComment } from 'react-icons/fa'; // Import icons

const ContactPage = () => {
  return (
    <div className="container mx-auto py-12 px-6">
      {/* Contact Form and Details Section */}
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Contact Form */}
        <section className="flex-1  p-8 rounded-lg">
          <h2 className="text-2xl font-normal text-center text-brand-blue mb-6">Contact Us</h2>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-lg font-normal text-brand-blue flex items-center gap-2">
                <FaUser className="text-brand-blue" /> Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-lg font-normal text-brand-blue flex items-center gap-2">
                <FaEnvelope className="text-brand-blue" /> Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-lg font-normal text-brand-blue flex items-center gap-2">
                <FaComment className="text-brand-blue" /> Message
              </label>
              <textarea
                id="message"
                rows="5"
                placeholder="Your Message"
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none h-40 focus:border-blue-500"
                ></textarea>
            </div>
            <button
              type="submit"
              className="bg-brand-blue text-white p-4 rounded-lg hover:bg-brand-dark-blue transition font-medium"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Contact Details */}
        <section className="flex-1 p-8 rounded-lg">
          <h2 className="text-2xl font-normal text-center text-brand-blue mb-6">Get in Touch</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-3xl text-brand-blue" />
              <div>
                <h3 className="text-xl font-normal text-brand-blue">Email</h3>
                <p className="text-lg text-brand-gray-dark">contact@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaPhone className="text-3xl text-brand-blue" />
              <div>
                <h3 className="text-xl font-normal text-brand-blue">Phone</h3>
                <p className="text-lg text-brand-gray-dark">+1 (123) 456-7890</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-3xl text-brand-blue" />
              <div>
                <h3 className="text-xl font-normal text-brand-blue">Address</h3>
                <p className="text-lg text-brand-gray-dark">123 Main Street, City, Country</p>
              </div>
            </div> */}
          </div>
        </section>
      </div>

      {/* Map Section
      <section className="mt-12">
        <h2 className="text-2xl font-normal text-center text-brand-blue mb-6">Our Location</h2>
        <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg">
          <iframe
            className="absolute inset-0 w-full h-full border-none"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8377168654294!2d-122.41941568468117!3d37.77492927975981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085805e1c9e9147%3A0x7a5a4f2a5e5f8b7b!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1624923452807!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section> */}
    </div>
  );
};

export default ContactPage;
