import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import axios from 'axios';

const Services = () => {
  const [servicesData, setServicesData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/services/'); // Replace with your API endpoint
        setServicesData(response.data);
      } catch (error) {
        console.error('Failed to fetch services data', error);
      }
    };

    fetchServices();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-4xl font-normal text-center text-brand-blue mb-8">Our Services</h1>
      <p className="text-lg mb-12 text-center text-brand-gray-dark">
        At EthioGuru, we connect you with top professionals across various domains to help you achieve your business goals.
      </p>
      <div className="space-y-6">
        {servicesData.map((service, index) => (
          <div key={service.id} className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-normal">{service.name}</h2>
              <button
                className="text-2xl text-brand-blue"
                onClick={() => toggleExpand(index)}
              >
                {expandedIndex === index ? <FaMinus /> : <FaPlus />}
              </button>
            </div>
            {expandedIndex === index && (
              <ul className="mt-4 space-y-2 pl-4 list-disc list-inside text-brand-gray-dark">
                {service.technologies.map((tech) => (
                  <li key={tech.id} className="text-lg">
                    {tech.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
