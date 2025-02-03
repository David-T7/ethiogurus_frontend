import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const WaitlistSignup = () => {
  const [searchParams] = useSearchParams();
  const fieldId = searchParams.get("field");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    field: fieldId || "",
  });
  const [fields, setFields] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/fields/")
      .then(response => setFields(response.data))
      .catch(error => console.error("Error loading fields:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/user/waitlist/", formData);
      setSuccessMessage("You have successfully joined the waitlist!");
      setFormData({ full_name: "", email: "", field: fieldId || "" });
    } catch (error) {
      console.error("Error joining waitlist:", error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <h2 className="text-3xl font-normal text-brand-blue mb-4 text-center">
        Join the Waitlist
      </h2>
      <p className="text-center mb-4">
        Enter your details, and we'll notify you once we start accepting this field.
      </p>

      {successMessage && (
        <p className="text-green-600 text-center">{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-100 p-6 rounded-lg">
        <div className="mb-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
        </div>

        <div className="mb-4">
          <select
            name="field"
            value={formData.field}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
            <option value="">Select a field</option>
            {fields.map(field => (
              <option key={field.id} value={field.id}>{field.name}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit"
          className="bg-brand-blue text-white p-3 rounded-lg w-full hover:bg-brand-dark-blue transition-colors duration-300"
        >
          Join Waitlist
        </button>
      </form>
    </div>
  );
};

export default WaitlistSignup;
