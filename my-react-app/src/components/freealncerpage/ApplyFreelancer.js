import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  FaFileAlt,
  FaUser,
  FaCode,
  FaBullhorn,
  FaEnvelope,
  FaAward,
  FaPencilAlt,
  FaLock,
  FaList,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
const ApplyAsFreelancer = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    field: "",
    services: [],
    password: "",
    confirmPassword: "",
    resume_file: null,
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldMessage, setFieldMessage] = useState(""); // State to store the field-specific message

  const fetchFields = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/fields/");
    return response.data;
  };
  const { data: fields = [], isLoading: fieldsLoading, error: fieldsError } = useQuery({
    queryKey: ["fields"],
    queryFn: fetchFields,
  });

  const fetchServices = async ({ queryKey }) => {
    const [, fieldId] = queryKey;
    const response = await axios.get(`http://127.0.0.1:8000/api/field-services/?field_id=${fieldId}`);
    return response.data;
  };
  const { data: availableServices = [], refetch: refetchServices } = useQuery({
    queryKey: ["services", formData.field],
    queryFn: fetchServices,
    enabled: !!formData.field,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });

    // Check if the selected field is not 'Developer' and show a message
    if (name === "field") {
      const selectedField = fields.find(field => field.id === value);
      if (selectedField && selectedField.name !== "Developer") {
        setFieldMessage(
          <>
            We are not currently accepting <b>{selectedField.name}</b>. 
            We will notify you once we start accepting this field.  
            <Link 
              to={`/waitlist?field=${selectedField.id}`} 
              className="text-blue-500 underline ml-2">
              Join the Waitlist
            </Link>
          </>
        );
      } else {
        setFieldMessage(""); // Clear message if 'Developer' is selected
      }
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume_file: e.target.files[0] });
    setErrors({ ...errors, resume_file: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Full name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.field) newErrors.field = "Field of expertise is required.";
    if (!formData.services.length) newErrors.services = "At least one service must be selected.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
    if (formData.password && formData.password.length < 5)
      newErrors.password = "Password must be at least 5 characters long.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.resume_file) newErrors.resume_file = "Resume file is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("full_name", data.full_name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.resume_file) formData.append("resume_file", data.resume_file);
      data.services.forEach((service) => {
        formData.append("applied_positions", service);
      });

      return axios.post("http://127.0.0.1:8000/api/resumes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      setSuccessMessage("Application successful! Activate you emal using link on your email inbox.");
      setIsSubmitting(false);
      setFormData({
        full_name: "",
        email: "",
        field: "",
        services: [],
        password: "",
        confirmPassword: "",
        resume_file: null,
      });
      setErrors({});
    },
    onError: (error) => {
      setIsSubmitting(false);
      if (error.response?.data?.email) {
        setErrors({ email: "Email already in use!" });
      } else {
        console.error("Error submitting application:", error);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  if (fieldsLoading) return <p className="text-center mt-4">Loading...</p>;
  if (fieldsError) return <p className="text-center mt-4">Error loading fields: {fieldsError.message}</p>;

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
              <FaUser className="inline mr-2" />Full Name</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {errors.full_name && <p className="text-red-600">{errors.full_name}</p>}
        </div>

        <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-lg font-normal text-brand-blue">
        <FaEnvelope className="inline mr-2" />Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {errors.email && <p className="text-red-600">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="field" className="text-lg font-normal text-brand-blue">
              <FaAward className="inline mr-2" />Field</label>
          <select
            id="field"
            name="field"
            value={formData.field}
            onChange={(e) => {
              handleChange(e);
              refetchServices();
            }}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a field</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
          {errors.field && <p className="text-red-600">{errors.field}</p>
          
          }
       {fieldMessage && <p className="text-yellow-600">{fieldMessage}</p>} 

        </div>

        {formData.field && (
         <div className="flex flex-col gap-2">
         <label htmlFor="services" className="text-lg font-normal text-brand-blue">
           <FaList className="inline mr-2" />Services</label>
            <select
              id="services"
              name="services"
              multiple
              value={formData.services}
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                setFormData({ ...formData, services: selectedOptions });
                setErrors({ ...errors, services: "" });
              }}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              >
              {availableServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.services && <p className="text-red-600">{errors.services}</p>}
          </div>
        )}

        <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="text-lg font-normal text-brand-blue">
              <FaLock className="inline mr-2" />
              Password</label>
          <input
            id="password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
           <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
            >
              {!passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          {errors.password && <p className="text-red-600">{errors.password}</p>}
        </div>

        <div className="flex flex-col gap-2 relative">
            <label htmlFor="password" className="text-lg font-normal text-brand-blue">
              <FaLock className="inline mr-2" />Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={confirmPasswordVisible ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
           <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800"
            >
              {!confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword}</p>}
        </div>

        <div className="flex flex-col gap-2">
            <label htmlFor="resume_file" className="text-lg font-normal text-brand-blue">
              <FaFileAlt className="inline mr-2" />Resume File</label>
          <input
            id="resume_file"
            name="resume_file"
            type="file"
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          />
          {errors.resume_file && <p className="text-red-600">{errors.resume_file}</p>}
        </div>

        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}

        <button
          type="submit"
          className="bg-brand-blue text-white p-3 rounded-lg hover:bg-brand-dark-blue transition-colors duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Apply"}
        </button>
      </form>
      </section>
    </div>
  );
};

export default ApplyAsFreelancer;