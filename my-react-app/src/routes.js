// src/routes.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './components/landingpage/LandingPage';
import LoginPage from './components/LoginPage';
import ApplyFreelancer from './components/freealncerpage/ApplyFreelancer';
import ApplyClient from './components/clientpage/ApplyClient';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ServicePage from './components/Services';
import ClientsPage from './components/clientpage/ClientsPage';
import HiringNeeds from './components/clientpage/HiringNeeds';
import TimeCommitment from './components/clientpage/TimeCommitment';
import Skills from './components/clientpage/Skills';
import FinalizePage from './components/clientpage/FinalizePage ';
import ForgotPasswordPage from './components/ForgotPasswordPage ';
import ProjectDescriptionPage from './components/clientpage/ProjectDescription';
import TalentListPage from './components/clientpage/talentList';
import FreelancerDetailPage from './components/clientpage/FreelancerDetailPage';
import FreelancerTestsPage from './components/freealncerpage/FreelnacerTestPage';
import FreelancerPage from './components/freealncerpage/FreelancerPage';
import TestsPage from './components/freealncerpage/FreelnacerTestPage';
import TestDetailPage from './components/freealncerpage/TestDetailPage';
import TestPage from './components/freealncerpage/TestPage';
import TestResultPage from './components/freealncerpage/TestResultPage';
import CodingTestPage from './components/freealncerpage/CodingTestPage';
import CodingTestResultPage from './components/freealncerpage/CodingTestResultPage';
import ContactFreelancer from './components/clientpage/ContactFreelancer';
import ProjectsPage from './components/clientpage/ProjectsPage';
import ProjectDetailPage from './components/clientpage/ProjectDetailPage';
import DisputePage from './components/clientpage/DisputePage';
import CreateContractPage from './components/clientpage/CreateContractPage';
import ClientLayout from './components/clientpage/ClientLayoutPage';
import ClientDashboard from './components/clientpage/ClientDashboard';
import NotificationPage from './components/NotificationPage';
import ContractsPage from './components/clientpage/ContractsPage';
import ContractDetailsPage from './components/clientpage/ContractDetailsPage ';
import EditContractPage from './components/clientpage/EditContractPage';
import FreelancerDashboard from './components/freealncerpage/FreelancerDashboard';
import FreelancerProfileLayout from './components/freealncerpage/FreelancerLayoutPage';
import ProjectListPage from './components/freealncerpage/ProjectListPage';
import ProjectDetails from './components/freealncerpage/ProjectDetailPage';
import ContractsList from './components/freealncerpage/ContractsList';
import ContractDetails from './components/freealncerpage/ContractDetails';
import ClientInbox from './components/clientpage/ClientInbox';
import FreelancerInbox from './components/freealncerpage/FreelancerInbox';
import ContactUser from './components/contact-user';
const RoutesConfig = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
        <Route path="/apply-freelancer" element={<Layout><ApplyFreelancer /></Layout>} />
        <Route path="/apply-freelancer/test-page" element={<FreelancerTestsPage />} />
        <Route path="/freelancer/:id" element={<FreelancerPage />} />
        <Route path="/tests" element={<TestsPage />} />
        <Route path="/test/:id" element={<TestDetailPage />} />
        <Route path="/test/:id/start" element={<TestPage />} />
        <Route path="/coding-test/:id" element={<CodingTestPage />} />
        <Route path="/test-result" element={<TestResultPage />} />
        <Route path="/coding-test-result" element={<CodingTestResultPage />} />
        <Route path="/hire-talent" element={<Layout><ApplyClient /></Layout>} />
        <Route path="/create-project" element={<ClientLayout><ApplyClient /></ClientLayout>} />
        <Route path="/create-project/requirements" element={<ClientLayout><HiringNeeds /></ClientLayout>} />
        <Route path="/create-project/time-commitment" element={<ClientLayout><TimeCommitment /></ClientLayout>} />
        <Route path="/create-project/skills" element={<ClientLayout><Skills /></ClientLayout>} />
        <Route path="/create-project/talent-list" element={<ClientLayout><TalentListPage /></ClientLayout>} />
        <Route path="/dashboard" element={<ClientLayout><ClientDashboard /></ClientLayout>} />
        <Route path="/create-project/project-description" element={<ClientLayout><ProjectDescriptionPage /></ClientLayout>} />
        <Route path="/hire-talent/requirements" element={<Layout><HiringNeeds /></Layout>} />
        <Route path="/hire-talent/time-commitment" element={<Layout><TimeCommitment /></Layout>} />
        <Route path="/hire-talent/skills" element={<Layout><Skills /></Layout>} />
        <Route path="/hire-talent/finalize" element={<Layout><FinalizePage /></Layout>} />
        <Route path="/contact-freelancer/:id" element={<ContactFreelancer />} />
        <Route path="/inbox" element={<ClientInbox />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/:id/create-contract" element={<CreateContractPage />} />
        <Route path="/projects/:id/dispute" element={<DisputePage />} />
        <Route path="/hire-talent/talent-list" element={<Layout><TalentListPage /></Layout>} />
        <Route path="/hire-talent/talent-list/:freelancerId" element={<Layout><FreelancerDetailPage /></Layout>} />
        <Route path="/hire-talent/project-description" element={<Layout><ProjectDescriptionPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/services" element={<Layout><ServicePage /></Layout>} />
        <Route path="/clients" element={<Layout><ClientsPage /></Layout>} />
        <Route path="/notification" element={<ClientLayout><NotificationPage /></ClientLayout>} />
        <Route path="/contracts" element={<ClientLayout><ContractsPage /></ClientLayout>} />
        <Route path="/contracts/:id" element={<ClientLayout><ContractDetailsPage /></ClientLayout>} />      
        <Route path="/contracts/:id/edit" element={<ClientLayout><EditContractPage /></ClientLayout>} />
        <Route path="/home" element={<FreelancerProfileLayout><FreelancerDashboard /></FreelancerProfileLayout>} />
        <Route path="/myprojects" element={<FreelancerProfileLayout><ProjectListPage /></FreelancerProfileLayout>} />
        <Route path="/myprojects/:id" element={<FreelancerProfileLayout><ProjectDetails /></FreelancerProfileLayout>} />
        <Route path="/mycontracts" element={<FreelancerProfileLayout><ContractsList /></FreelancerProfileLayout>} />
        <Route path="/mycontracts/:id" element={<FreelancerProfileLayout><ContractDetails /></FreelancerProfileLayout>} />
        <Route path="/messages" element={<FreelancerInbox/>} />
        <Route path="/messages/:id" element={<FreelancerProfileLayout><ContactUser/></FreelancerProfileLayout>} />
      </Routes>
    </Router>
  );
};

export default RoutesConfig;