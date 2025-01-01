import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaUser, FaComment } from 'react-icons/fa'; // Import icons
import axios from 'axios';
const ContactPage = () => {
  // State for form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // State for validation errors
  const [errors, setErrors] = useState({});

  const sendMail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!message) newErrors.message = "Message is required";
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/user/send-email/", {
          name,
          email,
          message,
          to_email: "ethiogurus@gmail.com",
          subject: "New Contact Message",
        });
  
        if (response.status === 200) {
          setSuccessMessage("Your message was sent successfully!");
          setErrorMessage("");
          setName("");
          setEmail("");
          setMessage("");
        } else {
          setErrorMessage("Failed to send your message. Please try again.");
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.error || "An error occurred. Please try again later."
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="container mx-auto py-12 px-6">
      {/* Contact Form and Details Section */}
      <div className="flex flex-col lg:flex-row gap-12 justify-center items-center">

        {/* Contact Form */}
        <section className="w-full max-w-lg p-8">
          <h2 className="text-3xl font-thin text-center text-brand-blue mb-6">Contact Us</h2>

          {/* Contact Info */}
          <div className="max-w-md mx-auto mb-8 text-center">
            <p className="text-lg font-normal text-gray-900">
              <span className='text-brand-blue'>Email:</span> ethiogurus@gmail.com
            </p>
            <p className="text-lg font-normal text-gray-900">
              <span className='text-brand-blue'>Phone:</span> +251900000000
            </p>
            <p className="text-gray-600 mt-2">
              Our team will reply to your message in a short time.
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={sendMail} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-lg font-normal text-brand-blue flex items-center gap-2">
                <FaUser className="text-brand-blue" /> Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-lg font-normal text-brand-blue flex items-center gap-2">
                <FaEnvelope className="text-brand-blue" /> Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-lg font-normal text-brand-blue flex items-center gap-2">
                <FaComment className="text-brand-blue" /> Message
              </label>
              <textarea
                id="message"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue"
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
            </div>

            <button
            type="submit"
            className="bg-blue-500 px-6 py-3 rounded-lg text-lg text-white hover:bg-blue-600 transition duration-300 w-full"
            disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {successMessage && <p className="mt-2 text-center text-green-600">{successMessage}</p>}
            {errorMessage && <p className="mt-2 text-center text-red-600">{errorMessage}</p>}
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
