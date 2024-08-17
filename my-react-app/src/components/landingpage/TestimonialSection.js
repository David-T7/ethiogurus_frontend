// src/components/TestimonialSection.js
import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    text: "EthioGuru helped us find top-notch freelancers who delivered exceptional results on time. Highly recommended!",
    name: "Client Name 1",
  },
  {
    text: "The quality of talent available on EthioGuru is unmatched. We have successfully completed several projects with their freelancers.",
    name: "Client Name 2",
  },
  {
    text: "Exceptional service and professionalism. EthioGuru's freelancers are highly skilled and reliable.",
    name: "Client Name 3",
  },
  {
    text: "Exceptional service and professionalism. EthioGuru's freelancers are highly skilled and reliable.",
    name: "Client Name 4",
  },
  {
    text: "Exceptional service and professionalism. EthioGuru's freelancers are highly skilled and reliable.",
    name: "Client Name 5",
  },
  {
    text: "Exceptional service and professionalism. EthioGuru's freelancers are highly skilled and reliable.",
    name: "Client Name 6",
  },
  // Add more testimonials as needed
];

const TestimonialSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [testimonialsPerPage, setTestimonialsPerPage] = useState(3); // Default value

  useEffect(() => {
    const updateTestimonialsPerPage = () => {
      const newTestimonialsPerPage = window.innerWidth < 640 ? 1 : 3;
      if (newTestimonialsPerPage !== testimonialsPerPage) {
        setTestimonialsPerPage(newTestimonialsPerPage);
        // Reset the current page to 0 if it exceeds the number of available pages
        const newPageCount = Math.ceil(testimonials.length / newTestimonialsPerPage);
        if (currentPage >= newPageCount) {
          setCurrentPage(newPageCount - 1);
        }
      }
    };

    // Initial check
    updateTestimonialsPerPage();

    // Add event listener to handle screen resizing
    window.addEventListener('resize', updateTestimonialsPerPage);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateTestimonialsPerPage);
  }, [testimonialsPerPage, currentPage]);

  const pagesVisited = currentPage * testimonialsPerPage;
  const pageCount = Math.ceil(testimonials.length / testimonialsPerPage);

  const handlePageClick = (selected) => {
    setCurrentPage(selected);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-normal text-center text-brand-blue mb-8">What Our Clients Say</h2>
        <div className="flex flex-wrap -m-4">
          {testimonials
            .slice(pagesVisited, pagesVisited + testimonialsPerPage)
            .map((testimonial, index) => (
              <div key={index} className="p-4 w-full sm:w-1/2 md:w-1/3 flex">
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full transition-transform duration-500 ease-in-out transform hover:scale-105">
                  <div className="flex-1">
                    <p className="text-lg italic text-gray-600">{testimonial.text}</p>
                    <p className="mt-4 text-gray-800 font-semibold">
                      {testimonial.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-center mt-6">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 mx-1 rounded-full transition-colors duration-300 ${index === currentPage ? 'bg-blue-500' : 'bg-gray-300'}`}
              onClick={() => handlePageClick(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
