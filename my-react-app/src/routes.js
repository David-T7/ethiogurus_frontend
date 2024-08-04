// src/routes.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './components/landingpage/LandingPage';
import LoginPage from './components/LoginPage';
import ApplyFreelancer from './components/ApplyFreelancer';
import ApplyClient from './components/ApplyClient';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ServicePage from './components/Services';
import ClientsPage from './components/ClientsPage';
const RoutesConfig = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/apply-freelancer" element={<Layout><ApplyFreelancer /></Layout>} />
        <Route path="/apply-client" element={<Layout><ApplyClient /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/services" element={<Layout><ServicePage /></Layout>} />
        <Route path="/clients" element={<Layout><ClientsPage /></Layout>} />
      </Routes>
    </Router>
  );
};

export default RoutesConfig;