import React, { useEffect, useState } from "react";

const TestimonialSection = () => {
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
      text: "EthioGuru helped us find top-notch freelancers who delivered exceptional results on time. Highly recommended!",
      name: "Client Name 4",
    },
    {
      text: "The quality of talent available on EthioGuru is unmatched. We have successfully completed several projects with their freelancers.",
      name: "Client Name 5",
    },
    {
      text: "Exceptional service and professionalism. EthioGuru's freelancers are highly skilled and reliable.",
      name: "Client Name 6",
    },
    {
      text: "EthioGuru helped us find top-notch freelancers who delivered exceptional results on time. Highly recommended!",
      name: "Client Name 7",
    },
    {
      text: "The quality of talent available on EthioGuru is unmatched. We have successfully completed several projects with their freelancers.",
      name: "Client Name 8",
    },
    {
      text: "Exceptional service and professionalism. EthioGuru's freelancers are highly skilled and reliable.",
      name: "Client Name 9",
    },
    {
      text: "Exceptional service and professionalism. EthioGuru's freelancers are highly skilled and reliable.",
      name: "Client Name 10",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12 relative overflow-hidden">
      <h2 className="text-3xl font-semibold mb-6 text-center text-brand-blue">
        What Our Clients Say
      </h2>
      <div className="relative w-full">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${100}%`,
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div
              key={pageIndex}
              className="flex w-full flex-shrink-0 justify-between"
            >
              {testimonials
                .slice(
                  pageIndex * testimonialsPerPage,
                  (pageIndex + 1) * testimonialsPerPage
                )
                .map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl w-full mx-2 flex-grow flex-shrink-0"
                    style={{ maxWidth: "calc(100% / 3 - 16px)" }}
                  >
                    <p className="text-brand-gray-dark mb-4">
                      "{testimonial.text}"
                    </p>
                    <p className="text-gray-600 font-semibold">
                      — {testimonial.name}
                    </p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full mx-2 cursor-pointer ${
              currentIndex === index ? "bg-brand-blue" : "bg-gray-400"
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
