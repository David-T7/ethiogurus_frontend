import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Import icons

const ContactPage = () => {
  return (
    <div className="container mx-auto py-12 px-6">
      {/* Contact Form */}
      <div className="flex flex-col lg:flex-row gap-12">
        <section className="flex-1 bg-gray-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-brand-blue mb-6">Contact Us</h2>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-lg font-medium text-brand-blue">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your Name"
                className="p-3 border rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-lg font-medium text-brand-blue">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Your Email"
                className="p-3 border rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-lg font-medium text-brand-blue">Message</label>
              <textarea
                id="message"
                rows="5"
                placeholder="Your Message"
                className="p-3 border rounded-lg"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* Contact Details */}
        <section className="flex-1 bg-gray-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-brand-blue mb-6">Get in Touch</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-3xl text-brand-blue" />
              <div>
                <h3 className="text-xl font-semibold text-brand-blue">Email</h3>
                <p className="text-lg text-brand-gray-dark">contact@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaPhone className="text-3xl text-brand-blue" />
              <div>
                <h3 className="text-xl font-semibold text-brand-blue">Phone</h3>
                <p className="text-lg text-brand-gray-dark">+1 (123) 456-7890</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-3xl text-brand-blue" />
              <div>
                <h3 className="text-xl font-semibold text-brand-blue">Address</h3>
                <p className="text-lg text-brand-gray-dark">123 Main Street, City, Country</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Optional: Map Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold text-center text-brand-blue mb-6">Our Location</h2>
        <div className="relative w-full h-64">
          {/* Replace with an actual map embed or component */}
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8377168654294!2d-122.41941568468117!3d37.77492927975981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085805e1c9e9147%3A0x7a5a4f2a5e5f8b7b!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1624923452807!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
