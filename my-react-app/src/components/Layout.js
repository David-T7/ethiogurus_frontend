import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUserPlus } from 'react-icons/fa';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Disable body scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
  }, [isMenuOpen]);

  // Handle window resize to close the menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="relative flex flex-col md:flex-row justify-between items-center p-6 bg-brand-blue text-white">
        {/* Mobile Menu Button */}
        <button
          className="absolute top-6 right-6 md:hidden flex items-center text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {!isMenuOpen && <FaBars />}
        </button>

        {/* Top-left branding and navigation */}
        <div className="flex flex-col md:flex-row items-center space-x-6 w-full md:w-auto">
          <Link to="/" className="text-2xl font-bold">EthioGuru</Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/services" className="hover:underline text-brand-light hover:text-brand-green">Services</Link>
            <Link to="/clients" className="hover:underline text-brand-light hover:text-brand-green">Clients</Link>
            <Link to="/contact" className="hover:underline text-brand-light hover:text-brand-green">Contact</Link>
            <Link to="/about" className="hover:underline text-brand-light hover:text-brand-green">About Us</Link>

          </nav>
        </div>

        {/* Top-right navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/apply-freelancer" className="hover:underline text-brand-light hover:text-brand-green">Apply as a Freelancer</Link>
          <Link to="/hire-talent" className="hover:underline text-brand-light hover:text-brand-green">Hire a Talent</Link>
          <Link to="/login" className="hover:underline text-brand-light hover:text-brand-green">Login</Link>
        </nav>

        {/* Mobile Menu Navigation */}
        <div className={`fixed inset-0 bg-black bg-opacity-70 ${isMenuOpen ? 'block' : 'hidden'} transition-opacity duration-300 ease-in-out`} onClick={() => setIsMenuOpen(false)}>
          <nav className={`fixed inset-0 flex flex-col items-center justify-center space-y-6 bg-brand-blue text-white transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <button
              className="absolute top-6 right-6 text-2xl text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTimes />
            </button>
            <div className="flex flex-col items-center space-y-4">
              <Link to="/" className="text-2xl font-bold" onClick={() => setIsMenuOpen(false)}>EthioGuru</Link>
              <nav className="flex flex-col space-y-4">
                <Link to="/services" className="hover:underline text-brand-light hover:text-brand-green" onClick={() => setIsMenuOpen(false)}>Services</Link>
                <Link to="/clients" className="hover:underline text-brand-light hover:text-brand-green" onClick={() => setIsMenuOpen(false)}>Clients</Link>
                <Link to="/contact" className="hover:underline text-brand-light hover:text-brand-green" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                <Link to="/about" className="hover:underline text-brand-light hover:text-brand-green" onClick={() => setIsMenuOpen(false)}>About Us</Link>

              </nav>
              <div className="flex flex-col items-center space-y-4 mt-8">
                <button className="text-brand-light hover:text-brand-green" onClick={() => { window.location.href = '/apply-freelancer'; setIsMenuOpen(false); }}>Apply as a Freelancer</button>
                <Link
                  to="/apply-client"
                  className="flex items-center justify-center bg-brand-green text-white px-6 py-3 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-lg hover:bg-green-600"
                >
                  <FaUserPlus className="mr-2" /> Hire a Talent
                </Link>
                <button className="text-brand-light hover:text-brand-green" onClick={() => { window.location.href = '/login'; setIsMenuOpen(false); }}>Login</button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <div className={`flex flex-1 ${isMenuOpen ? 'hidden' : 'block'} transition-transform duration-300`}>
        <main className="flex-1  bg-brand-gray-light">
          {children}
        </main>
      </div>
      <footer className="p-4 bg-brand-blue text-white text-center">
        <p>&copy; 2024 EthioGuru. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
