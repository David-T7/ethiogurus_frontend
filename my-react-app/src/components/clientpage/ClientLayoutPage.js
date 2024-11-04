import React, { useState, useEffect, useRef , useContext } from "react";
import { Link, useLocation , useNavigate} from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUserCog,
  FaUserEdit,
  FaSignOutAlt,
  FaLock,
} from "react-icons/fa";
import profilePic from "../../images/default-profile-picture.png"; // Default profile picture
import logo from "../../images/EG_MIX_Logo.png"

import { AuthContext } from '../AuthContext'; // Update this path according to your project structure
import { clientUserContext } from "../clientUserContext";
const ClientLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Dropdown menu for profile
  const location = useLocation(); // For determining the current route
  const menuRef = useRef(null); // Ref for the dropdown menu
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { profilePicture, unreadMessages, unreadNotifications:unreadNotification } = useContext(clientUserContext);

  // Disable body scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  // Handle window resize to close the menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getLinkClasses = (path) => {
    const baseClasses =
      "relative px-4 py-2 transition-colors duration-300 text-md font-medium";
    const activeClasses =
      'text-brand-green font-semibold before:content-[""] before:absolute before:block before:w-full before:h-[2px] before:bg-brand-green before:bottom-0 before:left-0';
    const hoverClasses =
      'hover:text-brand-green hover:before:content-[""] hover:before:block hover:before:w-full hover:before:h-[2px] hover:before:bg-brand-green hover:before:bottom-0 hover:before:left-0';

    return location.pathname === path
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${hoverClasses}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally redirect to login page after logout
      navigate("/login")
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="relative flex flex-col md:flex-row items-center p-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white">
        {/* Mobile Menu Button */}
        {!isMenuOpen && (
          <button
            className="absolute top-6 right-6 md:hidden flex items-center text-2xl z-20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars />
          </button>
        )}

        {/* Top-left branding */}
        <div className="absolute left-6 top-6 flex items-center">
       <Link to="/dashboard">
      <img src={logo} alt="EthioGurus Logo" className="w-20 h-12" />
      </Link> {/* Adjust size as needed */}
      <Link to="/dashboard" className="font-normal text-2xl">
        EthioGurus
      </Link>
    </div>

        {/* Top-right navigation */}
        <nav className="hidden md:flex space-x-4 absolute right-6 top-6 mr-20">
          <Link to="/projects" className={getLinkClasses("/projects")}>
            Projects
          </Link>
          <Link to="/contracts" className={getLinkClasses("/contracts")}>
            Contracts
          </Link>
          <Link to="/inbox" className={getLinkClasses("/inbox")}>
            Inbox
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadMessages}
              </span>
            )}
          </Link>
          <Link to="/notification" className={getLinkClasses("/notification")}>
            Notifications
            {unreadNotification > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadNotification}
              </span>
            )}
          </Link>
        </nav>

        {/* Profile Picture and Dropdown Menu */}
        <div className="relative flex ml-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 md:mr-0 mr-10 text-white hover:text-gray-200"
          >
            <img
              src={profilePicture || profilePic} // Replace with dynamic user profile picture
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
            />
          </button>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-16 w-48 bg-white border border-gray-300 rounded-lg shadow-lg"
            >
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
                    to="/profile-update"
                    className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <FaUserEdit /> Update Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/change-password"
                    className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded"
                  >
                    <FaLock /> Change Password
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
        <div
          className={`fixed inset-0 bg-black bg-opacity-70 ${
            isMenuOpen ? "block" : "hidden"
          } transition-opacity duration-300 ease-in-out`}
          onClick={() => setIsMenuOpen(false)}
        >
          <nav
            className={`fixed inset-0 flex flex-col items-center justify-center space-y-6 bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <button
              className="absolute top-6 right-6 text-2xl text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTimes />
            </button>
            <div className="flex flex-col items-center space-y-4">
              <Link
                to="/"
                className="text-2xl font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                EthioGurus
              </Link>
              <nav className="flex flex-col space-y-4">
                <Link to="/projects" className={getLinkClasses("/projects")}>
                  Projects
                </Link>
                <Link to="/contracts" className={getLinkClasses("/contracts")}>
            Contracts
             </Link>
                <Link to="/inbox" className={getLinkClasses("/inbox")}>
                  Inbox
                  {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadMessages}
              </span>
            )}
                </Link>
                <Link
                  to="/notification"
                  className={getLinkClasses("/notification")}
                >
                  Notifications
                  {unreadNotification > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadNotification}
              </span>
            )}
                </Link>
              </nav>
            </div>
          </nav>
        </div>
      </header>
      <main
        className={`flex-1 ${
          isMenuOpen ? "hidden" : "block"
        } transition-transform duration-300`}
      >
        {children}
      </main>
    </div>
  );
};

export default ClientLayout;
