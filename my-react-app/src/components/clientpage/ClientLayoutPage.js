import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCog, FaUserEdit, FaSignOutAlt, FaHome, FaBriefcase } from 'react-icons/fa';
import { IoMdMenu } from 'react-icons/io';
import profilePic from '../../images/default-profile-picture.png'; // Default profile picture

const ClientLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Dropdown menu for profile
  const location = useLocation(); // For determining the current route
  const menuRef = useRef(null); // Ref for the dropdown menu

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

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLinkClasses = (path) => {
    const baseClasses = 'relative px-4 py-2 transition-colors duration-300 text-lg font-medium';
    const activeClasses = 'text-brand-green font-semibold before:content-[""] before:absolute before:block before:w-full before:h-[2px] before:bg-brand-green before:bottom-0 before:left-0';
    const hoverClasses = 'hover:text-brand-green hover:before:content-[""] hover:before:block hover:before:w-full hover:before:h-[2px] hover:before:bg-brand-green hover:before:bottom-0 hover:before:left-0';

    return location.pathname === path
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${hoverClasses}`;
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logging out');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="relative flex flex-col md:flex-row items-center p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
        {/* Mobile Menu Button */}
        <button
          className="absolute top-6 right-6 md:hidden flex items-center text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {!isMenuOpen && <FaBars />}
        </button>

        {/* Top-left branding */}
        <Link to="/" className="text-2xl font-bold md:text-3xl absolute left-6 top-6">
          EthioGurus
        </Link>

        {/* Top-right navigation */}
        <nav className="hidden md:flex space-x-8 absolute right-6 top-6 mr-20">
          <Link to="/dashboard" className={getLinkClasses('/dashboard')}>Dashboard</Link>
          <Link to="/projects" className={getLinkClasses('/projects')}>Projects</Link>
          <Link to="/inbox" className={getLinkClasses('/inbox')}>Inbox</Link>
        </nav>

        {/* Profile Picture and Dropdown Menu */}
        <div className="relative flex items-center ml-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-white hover:text-gray-200"
          >
            <img
              src={profilePic} // Replace with dynamic user profile picture
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
            />
            <IoMdMenu className="text-xl" />
          </button>
          {menuOpen && (
            <div ref={menuRef} className="absolute right-0 mt-16 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
              <ul className="p-2">
                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <FaUserCog /> Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/update-profile"
                    className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <FaUserEdit /> Update Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-2 w-full text-gray-700 hover:bg-gray-100 rounded text-left"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu Navigation */}
        <div className={`fixed inset-0 bg-black bg-opacity-70 ${isMenuOpen ? 'block' : 'hidden'} transition-opacity duration-300 ease-in-out`} onClick={() => setIsMenuOpen(false)}>
          <nav className={`fixed inset-0 flex flex-col items-center justify-center space-y-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <button
              className="absolute top-6 right-6 text-2xl text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTimes />
            </button>
            <div className="flex flex-col items-center space-y-4">
              <Link to="/" className="text-2xl font-bold" onClick={() => setIsMenuOpen(false)}>ClientHub</Link>
              <nav className="flex flex-col space-y-4">
                <Link to="/dashboard" className={getLinkClasses('/dashboard')} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/projects" className={getLinkClasses('/projects')} onClick={() => setIsMenuOpen(false)}>Projects</Link>
                <Link to="/inbox" className={getLinkClasses('/inbox')} onClick={() => setIsMenuOpen(false)}>Inbox</Link>
              </nav>
              <button className="text-brand-light hover:text-brand-green" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Logout</button>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
};

export default ClientLayout;
