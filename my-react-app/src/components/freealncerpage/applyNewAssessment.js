import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaFileAlt, FaUser, FaCode, FaBullhorn, FaList } from "react-icons/fa";
import axios from "axios";
import { decryptToken } from "../../utils/decryptToken";

const ApplyNewAssessment = () => {
  const [formData, setFormData] = useState({
    field: "",
    services: [],
    resume_file: null,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const encryptedToken = localStorage.getItem('access'); // Get the encrypted token from localStorage
  const secretKey = process.env.REACT_APP_SECRET_KEY; // Ensure the same secret key is used
  const token = decryptToken(encryptedToken, secretKey); // Decrypt the token
  const [freelancerData , setFreelancerData] = useState(null);
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
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume_file: e.target.files[0] });
    setErrors({ ...errors, resume_file: "" });
  };

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/freelancer/manage/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFreelancerData(response.data);
      } catch (err) {
      console.log("unable to fetch freelancer data")
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, []);
  

  const validateForm = () => {
    const newErrors = {};
    if (!formData.field) newErrors.field = "Field of expertise is required.";
    if (!formData.services.length) newErrors.services = "At least one service must be selected.";
    if (!formData.resume_file) newErrors.resume_file = "Resume file is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("field", data.field);
      formData.append("resume_file", data.resume_file);
      formData.append("full_name", freelancerData.id);
      formData.append("email", freelancerData.email);
      formData.append("is_email_verified",true);
      formData.append("password",freelancerData.email)
      data.services.forEach((service) => {
        formData.append("applied_positions", service);
      });

      return axios.post("http://127.0.0.1:8000/api/resumes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      setSuccessMessage("Application successful!");
      setIsSubmitting(false);
      setFormData({ field: "", services: [], resume_file: null });
      setErrors({});
    },
    onError: (error) => {
      setIsSubmitting(false);
      console.error("Error submitting application:", error);
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
      <h2 className="text-3xl font-normal text-brand-blue mb-4 text-center">Apply as a Freelancer</h2>
      <section className="bg-gray-100 p-8 rounded-lg max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="field" className="text-lg font-normal text-brand-blue">
              <FaCode className="inline mr-2" /> Field of Expertise
            </label>
            <select
              id="field"
              name="field"
              value={formData.field}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a field</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>{field.name}</option>
              ))}
            </select>
            {errors.field && <p className="text-red-600">{errors.field}</p>}
          </div>

          <div>
            <label className="text-lg font-normal text-brand-blue">
              <FaList className="inline mr-2" /> Select Services
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableServices.map((service) => (
                <label key={service.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={service.id}
                    onChange={(e) => {
                      const newServices = e.target.checked
                        ? [...formData.services, service.id]
                        : formData.services.filter((id) => id !== service.id);
                      setFormData({ ...formData, services: newServices });
                    }}
                  />
                  {service.name}
                </label>
              ))}
            </div>
            {errors.services && <p className="text-red-600">{errors.services}</p>}
          </div>

          <div>
            <label htmlFor="resume_file" className="text-lg font-normal text-brand-blue">
              <FaFileAlt className="inline mr-2" /> Upload Resume
            </label>
            <input
              id="resume_file"
              name="resume_file"
              type="file"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
            {errors.resume_file && <p className="text-red-600">{errors.resume_file}</p>}
          </div>

          <button
            type="submit"
            className="bg-brand-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Apply Now"}
          </button>
        </form>
      </section>
      {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
    </div>
  );
};

export default ApplyNewAssessment;
