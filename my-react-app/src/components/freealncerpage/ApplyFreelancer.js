import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaFileAlt, FaUser, FaCode , FaBullhorn, FaEnvelope, FaAward, FaPencilAlt, FaLock, FaList, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const ApplyAsFreelancer = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    field: "", // Selected field
    services: [],
    password: "",
    confirmPassword: "",
    resume_file: null,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch fields
  const fetchFields = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/fields/");
    return response.data;
  };
  const { data: fields = [], isLoading: fieldsLoading, error: fieldsError } = useQuery({
    queryKey: ["fields"],
    queryFn: fetchFields,
  });

  // Fetch services for a selected field
  const fetchServices = async ({ queryKey }) => {
    const [, fieldId] = queryKey;
    const response = await axios.get(`http://127.0.0.1:8000/api/field-services/?field_id=${fieldId}`);
    return response.data;
  };
  const { data: availableServices = [], refetch: refetchServices } = useQuery({
    queryKey: ["services", formData.field],
    queryFn: fetchServices,
    enabled: !!formData.field, // Fetch only when a field is selected
  });

  // Form data change handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "services") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume_file: e.target.files[0] });
  };

  // Submit form
  const mutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.resume_file) {
        formData.append("resume_file", data.resume_file);
      }
      data.services.forEach((service) => {
        formData.append("applied_positions", service);
      });

      return axios.post("http://127.0.0.1:8000/api/resumes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      setSuccessMessage("Application successful! Watch out for emails regarding your results.");
      setFormData({
        full_name: "",
        email: "",
        field: "",
        services: [],
        password: "",
        confirmPassword: "",
        resume_file: null,
      });
    },
    onError: (error) => {
      if (error.response?.data?.email) {
        alert("Email already in use!");
      } else {
        console.error("Error submitting application:", error);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (formData.password.length < 5) {
      alert("Password must be at least 5 characters long!");
      return;
    }
    mutation.mutate(formData);
  };

  if (fieldsLoading) return <p>Loading...</p>;
  if (fieldsError) return <p>Error loading fields: {fieldsError.message}</p>;

  // Icons for fields
  const getFieldIcon = (fieldName) => {
    switch (fieldName) {
      case "Project Manager":
        return <FaPencilAlt className="text-brand-blue mr-2" />;
      case "Developer":
        return <FaCode className="text-brand-blue mr-2" />;
      case "Marketing Expert":
        return <FaBullhorn className="text-brand-blue mr-2" />;
      default:
        return <FaAward className="text-brand-blue mr-2" />;
    }
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="text-center mb-5">
        <h2 className="text-3xl font-normal text-brand-blue mb-4">Apply as a Freelancer</h2>
        <p className="text-lg text-brand-gray-dark">
          Join our network of top freelancers by filling out the application form below.
        </p>
      </section>

      <section className="bg-gray-100 p-8 rounded-lg max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="full_name" className="text-lg font-normal text-brand-blue">
              <FaUser className="inline mr-2" />
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Your Name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-lg font-normal text-brand-blue">
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
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="field" className="text-lg font-normal text-brand-blue">
              <FaAward className="inline mr-2" />
              Field of Expertise
            </label>
            <select
              id="field"
              name="field"
              value={formData.field}
              onChange={(e) => {
                handleChange(e);
                refetchServices();
              }}
              className="w-full border border-gray-300 p-2 rounded-lg"
            >
              <option value="">Select a Field</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name}
                </option>
              ))}
            </select>
          </div>

          {formData.field && (
            <div className="flex flex-col gap-2">
              <label htmlFor="services" className="text-lg font-normal text-brand-blue">
                <FaList className="inline mr-2" />
                Services Offered
              </label>
              <select
                id="services"
                name="services"
                multiple
                value={formData.services}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="text-lg font-normal text-brand-blue">
              <FaLock className="inline mr-2" />
              Password
            </label>
            <input
              id="password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              placeholder="Your Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="resume_file" className="text-lg font-normal text-brand-blue">
              <FaFileAlt className="inline mr-2" />
              Upload Resume
            </label>
            <input
              id="resume_file"
              name="resume_file"
              type="file"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
          >
            Submit Application
          </button>

          {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}
        </form>
      </section>
    </div>
  );
};

export default ApplyAsFreelancer;
