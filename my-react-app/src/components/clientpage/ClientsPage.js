import React from 'react';
import CountUp from 'react-countup';
import visaimage from "../../images/visa.png";
import spotifyimage from "../../images/spotify.png";
import bmwImage from "../../images/bmw.png";
import TestimonialSection from '../landingpage/TestimonialSection';

// Sample data for companies and testimonials
const companies = [
  { name: 'Spotify', logo: spotifyimage },
  { name: 'Visa', logo: visaimage },
  { name: 'BMW', logo: bmwImage },
  // Add more companies as needed
];

const testimonials = [
  {
    name: 'John Doe',
    position: 'CEO of Company A',
    text: 'EthioGuru has been instrumental in our success. Their professionalism and expertise are unparalleled.',
    photo: 'john-doe.png',
  },
  {
    name: 'Jane Smith',
    position: 'CTO of Company B',
    text: 'Working with EthioGuru has been a game-changer for us. Their team is top-notch!',
    photo: 'jane-smith.png',
  },
  // Add more testimonials as needed
];

const Clients = () => {
  const totalClients = 100; // Example number of clients we've worked with

  return (
    <div className="container mx-auto py-12 px-6">
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-brand-blue mb-8">Companies We've Worked With</h2>
        <div className="flex flex-wrap justify-center items-center space-x-6 space-y-6">
          {companies.map((company, index) => (
            <div
              key={index}
              className="w-32 h-32 flex items-center justify-center bg-brand-gray-light"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="max-w-full max-h-full object-contain "
              />
            </div>
          ))}
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-brand-blue mb-8">Our Impact</h2>
        <div className="flex flex-col items-center">
          <p className="text-5xl font-bold text-brand-green">
            <CountUp end={totalClients} duration={3} separator="," />
          </p>
          <p className="text-xl text-center text-brand-gray-dark mt-2">
            Clients we've successfully collaborated with
          </p>
        </div>
      </section>
      
      <section>
        <TestimonialSection />
      </section>
    </div>
  );
};

export default Clients;
