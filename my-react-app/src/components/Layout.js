import React, { useState, useEffect , useContext } from 'react';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserPlus } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // For determining the current route
  const {getRole} = useContext(AuthContext);
  const navigate = useNavigate()
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

  useEffect(() => {
    console.log("in layout redirect")
    const redirect = async () => {
      const role = await getRole();
      console.log("role found in layout is ",role)
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'freelancer') {
        navigate('/home');
      } else if (role === 'interviewer') {
        navigate('/welcome');
      } else if (role === 'client') {
        navigate('/dashboard');
      }
    };

    redirect();
  }, [navigate]);

  const getLinkClasses = (path) => {
    const baseClasses =
      "relative px-4 transition-colors duration-300 text-md font-normal";
    const activeClasses =
      'text-brand-green font-normal before:content-[""] before:absolute before:block before:w-full before:h-[2px] before:bg-brand-green before:bottom-0 before:left-0';
    const hoverClasses =
      'hover:text-brand-green hover:before:content-[""] hover:before:block hover:before:w-full hover:before:h-[2px] hover:before:bg-brand-green hover:before:bottom-0 hover:before:left-0';

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
        <div className="flex flex-col md:flex-row items-center space-x-6 w-full md:w-auto">
          <Link to="/" className="text-2xl font-semibold">EthioGurus</Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/services" className={getLinkClasses('/services')}>Services</Link>
            <Link to="/clients" className={getLinkClasses('/clients')}>Clients</Link>
            <Link to="/contact" className={getLinkClasses('/contact')}>Contact</Link>
            <Link to="/about" className={getLinkClasses('/about')}>About Us</Link>
          </nav>
        </div>

        {/* Top-right navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/apply-freelancer" className={getLinkClasses('/apply-freelancer')}>Apply as a Freelancer</Link>
          <Link to="/hire-talent" className={getLinkClasses('/hire-talent')}>Hire a Talent</Link>
          <Link to="/login" className={getLinkClasses('/login')}>Login</Link>
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
              <Link to="/" className="text-2xl font-semibold" onClick={() => setIsMenuOpen(false)}>EthioGuru</Link>
              <nav className="flex flex-col space-y-4">
                <Link to="/services" className={getLinkClasses('/services')} onClick={() => setIsMenuOpen(false)}>Services</Link>
                <Link to="/clients" className={getLinkClasses('/clients')} onClick={() => setIsMenuOpen(false)}>Clients</Link>
                <Link to="/contact" className={getLinkClasses('/contact')} onClick={() => setIsMenuOpen(false)}>Contact</Link>
                <Link to="/about" className={getLinkClasses('/about')} onClick={() => setIsMenuOpen(false)}>About Us</Link>
              </nav>
              <div className="flex flex-col items-center space-y-4 mt-8">
                <button className="text-brand-light hover:text-brand-green" onClick={() => { window.location.href = '/apply-freelancer'; setIsMenuOpen(false); }}>Apply as a Freelancer</button>
                <Link
                  to="/hire-talent"
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
        <main className="flex-1 bg-brand-gray-light">
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
