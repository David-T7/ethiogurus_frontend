const TestimonialSection = () => {
return(
<div className="w-full max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-brand-blue">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <p className="text-brand-gray-dark mb-4">
              "EthioGuru helped us find top-notch freelancers who delivered
              exceptional results on time. Highly recommended!"
            </p>
            <p className="text-gray-600 font-semibold">— Client Name 1</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <p className="text-brand-gray-dark mb-4">
              "The quality of talent available on EthioGuru is unmatched. We
              have successfully completed several projects with their
              freelancers."
            </p>
            <p className="text-gray-600 font-semibold">— Client Name 2</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <p className="text-brand-gray-dark mb-4">
              "Exceptional service and professionalism. EthioGuru's freelancers
              are highly skilled and reliable."
            </p>
            <p className="text-gray-600 font-semibold">— Client Name 3</p>
          </div>
        </div>
      </div>
      )
}

export default TestimonialSection;