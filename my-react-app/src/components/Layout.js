import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserPlus } from "react-icons/fa";
import { AuthContext } from "./AuthContext";
import CryptoJS from "crypto-js"; // Import CryptoJS for encryption/decryption
import logo from "../images/EG_MIX_Logo.png";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { getRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const redirectCalled = useRef(false); // Prevent repeated redirects

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  // Utility function to decrypt the token
  const decryptToken = (encryptedToken) => {
    if (!encryptedToken) {
      return null;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      const token = bytes.toString(CryptoJS.enc.Utf8);
      return token || null;
    } catch (error) {
      console.error("Error decrypting token:", error);
      return null;
    }
  };

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

  // Redirect user based on role
  useEffect(() => {
    if (redirectCalled.current) return; // Prevent multiple executions
    redirectCalled.current = true;

    const redirect = async () => {
      try {
        const encryptedToken = localStorage.getItem("access");
        const token = decryptToken(encryptedToken);

        if (!token) {
          console.warn("No valid token found. Redirecting to login.");
          navigate("/login");
          return;
        }

        const data = await getRole(); // Call getRole from AuthContext
        if (data && typeof data.role !== "undefined") {
          const { role, assessment } = data;
          console.log("Role found in layout:", role);

          // Perform redirection based on role
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "freelancer") {
            if (assessment) {
              navigate("/assessments");
            } else {
              navigate("/home");
            }
          } else if (role === "interviewer") {
            navigate("/welcome");
          } else if (role === "client") {
            navigate("/dashboard");
          } else if (role === "dispute-manager") {
            navigate("/latest-disputes");
          }
         else if (role === "resume-checker") {
          navigate("/resume-check");
        } 
          
        } else {
          console.warn("Invalid data returned from getRole:", data);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during redirection:", error);
        navigate("/login");
      }
    };

    redirect();
  }, [navigate, getRole]);

  const getLinkClasses = (path) => {
    const baseClasses =
      "relative px-4 transition-colors duration-300 text-md font-normal";
    const activeClasses =
      'text-brand-green font-normal before:content-[""] before:absolute before:block before:w-full before:h-[2px] before:bg-brand-green before:bottom-0 before:left-0';
    const hoverClasses =
      'hover:text-brand-green hover:before:content-[""] hover:before:block hover:before:w-full hover:h-[2px] hover:before:bg-brand-green hover:before:bottom-0 hover:before:left-0';

    return location.pathname === path
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${hoverClasses}`;
  };

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
        <div className="flex flex-col md:flex-row items-center space-x-0 w-auto md:w-auto">
          <Link to="/" className="flex items-center space-x-0">
            <img src={logo} alt="EthioGurus Logo" className="w-20 h-12" />
            <span className="font-normal text-2xl">EthioGurus</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center -left-10 space-x-6 w-auto md:w-auto">
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-4">
            <Link to="/services" className={getLinkClasses("/services")}>
              Services
            </Link>
            <Link to="/clients" className={getLinkClasses("/clients")}>
              Clients
            </Link>
            <Link to="/contact" className={getLinkClasses("/contact")}>
              Contact
            </Link>
            <Link to="/about" className={getLinkClasses("/about")}>
              About Us
            </Link>
          </nav>
        </div>

        {/* Top-right navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link
            to="/apply-freelancer"
            className={getLinkClasses("/apply-freelancer")}
          >
            Apply as a Freelancer
          </Link>
          <Link to="/hire-talent" className={getLinkClasses("/hire-talent")}>
            Hire a Talent
          </Link>
          <Link to="/login" className={getLinkClasses("/login")}>
            Login
          </Link>
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-1 bg-brand-gray-light">{children}</main>

      <footer className="p-4 bg-brand-blue text-white text-center">
        <p>&copy; 2024 EthioGuru. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
