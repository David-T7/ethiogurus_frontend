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
import ContractDetailsPage from './components/clientpage/ContractDetailsPage';
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
import SubmitCounterOffer from './components/freealncerpage/submitCounterOffer';
import FreelancerSettingsPage from './components/freealncerpage/FreelancerSettingsPage';
import UpdateProfilePage from './components/freealncerpage/UpdateProfilePage';
import ClientSettingsPages from './components/clientpage/ClientSettingsPage';
import UpdateProfile from './components/clientpage/UpdateProfilePage';
import DisputeResponsePage from './components/freealncerpage/DisputeResponsePage';
import EditProjectPage from './components/clientpage/EditProjectPage';
import CreateProjectPage from './components/clientpage/CreateProjectPage';
import ProjectBudgetEstimate from './components/clientpage/ProjectBudgetEstimate';
import ChangePasswordPage from './components/ChangePassword';
import SkillsPage from './components/freealncerpage/SkillsPage';
import StartNewTestPage from './components/freealncerpage/StartNewTestPage';
import CameraCheckPage from './components/freealncerpage/CameraCheckPage';
import TestTerminatedPage from './components/freealncerpage/TestTerminatedPage';
import SelectAppointmentDate from './components/freealncerpage/SelectAppointmentDate';
import AppointmentDetailsPage from './components/freealncerpage/AppointmentDetailsPage';
import UpdateDispute from './components/clientpage/UpdateDispute';
import ContactClient from './components/freealncerpage/contactClient';
import CounterOffersList from './components/freealncerpage/CounterOffersList';
import CounterOfferDetails from './components/freealncerpage/CounterOfferDetails';
import EditCounterOffer from './components/freealncerpage/EditCounterOffer';
import CounterOffers from './components/clientpage/CounterOffers';
import CounterOffer from './components/clientpage/CounterOfferPage';
import EditCounterOfferPage from './components/clientpage/EditCouterOfferPage';
import CreateCounterOffer from './components/clientpage/CreateCounterOffer';
import InterviewerDashboard from './components/interviewerPage/interviewerDashboard';
import InterviewerLayout from './components/interviewerPage/interviewerLayoutPage';
import AppointmentDetails from './components/interviewerPage/AppointmentDetails';
import AppointmentsPage from './components/interviewerPage/AppointmentsPage';
import InterviewsPage from './components/interviewerPage/InterviewsPage';
import InterviewPage from './components/interviewerPage/InterviewPage';
import UpdateInterviewerProfile from './components/interviewerPage/UpdateProfilePage';
import VerifyAccountPage from './components/freealncerpage/VerifyAccountPage';
import LivelinessTest from './components/freealncerpage/LivelinessTest';
import ContractDisputePage from './components/freealncerpage/CreateDisputePage';
import DisputesPage from './components/freealncerpage/DisputesPage';
import DisputeDetails from './components/freealncerpage/DisputeDetails';
import DisputeResponseDetailsPage from './components/freealncerpage/DisputeResonseDetails';
import EditDisputeResponsePage from './components/freealncerpage/EditDisputeResponsePage';
import ContractDisputeDetails from './components/clientpage/ContractDisptueDetails';
import ContractDisputes from './components/clientpage/ContractDisputes';
import ContractDisputeResponsePage from './components/clientpage/contractDisputeResponse';
import CounterDisputeResponsePage from './components/clientpage/CounterDisputeResponse';
import DisputeResponseCounter from './components/freealncerpage/DisputeReponseCounter';
import EditDisputePage from './components/freealncerpage/EditDisputePage';
import SendDisputeResponse from './components/clientpage/SendDisputeRepsponse';
import DisputeManagerDashboard from './components/drc/DrcDashboard';
import DrcLayout from './components/drc/DrcLayoutPage';
import DisputeHistoryPage from './components/drc/DisputeHistoryPage';
import DrcDisputeDetails from './components/drc/DrcDisputeDetails';
import DrcDisputeResponseDetails from './components/drc/DrcDisputeResponseDetails';
import ResolveDispute from './components/drc/ResolveDispute';
import DrcForwardedDisputes from './components/drc/DrcForwardedDisputes';
import UpdateDrcProfile from './components/drc/UpdateProfilePage';
import DrcSettingsPage from './components/drc/DrcSettings';
import AssessmentRoadmap from './components/assesment/AssesmentProgress';
import AssessmentLayout from './components/assesment/assesmentLayout';
import AssessmentsPage from './components/assesment/AssessmentsPage';


const RoutesConfig = () => {
  return (
      <Routes>
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/change-password" element={<ClientLayout><ChangePasswordPage /></ClientLayout>} />
        <Route path="/update-password" element={<FreelancerProfileLayout><ChangePasswordPage /></FreelancerProfileLayout>} />
        <Route path="/updatePassword" element={<InterviewerLayout><ChangePasswordPage /></InterviewerLayout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPasswordPage /></Layout>} />
        <Route path="/apply-freelancer" element={<Layout><ApplyFreelancer /></Layout>} />
        <Route path="/apply-freelancer/test-page" element={<FreelancerTestsPage />} />
        <Route path="/freelancer/:id" element={<FreelancerPage />} />
        <Route path="/tests" element={<FreelancerProfileLayout><TestsPage /></FreelancerProfileLayout>} />
        <Route path="/test/:id/:type" element={<FreelancerProfileLayout><TestDetailPage /></FreelancerProfileLayout>} />
        <Route path="/camera-check/:id/:type" element={<FreelancerProfileLayout><CameraCheckPage/></FreelancerProfileLayout>} />
        <Route path="/theory-test/:id" element={<FreelancerProfileLayout><TestPage /></FreelancerProfileLayout>} />
        <Route path="/coding-test/:id" element={<FreelancerProfileLayout><CodingTestPage /></FreelancerProfileLayout>} />
        <Route path="/test-result" element={<FreelancerProfileLayout><TestResultPage /></FreelancerProfileLayout>} />
        <Route path="/coding-test-result/:id" element={<FreelancerProfileLayout><CodingTestResultPage /></FreelancerProfileLayout>} />
        <Route path="/hire-talent" element={<Layout><ApplyClient /></Layout>} />
        <Route path="/find-talent" element={<ClientLayout><ApplyClient /></ClientLayout>} />
        <Route path="/create-project/requirements" element={<ClientLayout><HiringNeeds /></ClientLayout>} />
        <Route path="/create-project/time-commitment" element={<ClientLayout><TimeCommitment /></ClientLayout>} />
        <Route path="/create-project/skills" element={<ClientLayout><Skills /></ClientLayout>} />
        <Route path="/create-project/talent-list" element={<ClientLayout><TalentListPage /></ClientLayout>} />
        <Route path="/create-project/budget-estimate" element={<ClientLayout><ProjectBudgetEstimate /></ClientLayout>} />
        <Route path="/dashboard" element={<ClientLayout><ClientDashboard /></ClientLayout>} />
        <Route path="/settings" element={<ClientLayout><ClientSettingsPages /> </ClientLayout>} />        
        <Route path="/profile-update" element={<ClientLayout><UpdateProfile/> </ClientLayout>} />        
        <Route path="/create-project/project-description" element={<ClientLayout><ProjectDescriptionPage /></ClientLayout>} />
        <Route path="/hire-talent/requirements" element={<ClientLayout><HiringNeeds /></ClientLayout>} />
        <Route path="/hire-talent/time-commitment" element={<ClientLayout><TimeCommitment /></ClientLayout>} />
        <Route path="/hire-talent/skills" element={<ClientLayout><Skills /></ClientLayout>} />
        <Route path="/hire-talent/budget-estimate" element={<ClientLayout><ProjectBudgetEstimate /></ClientLayout>} />
        <Route path="/hire-talent/finalize" element={<Layout><FinalizePage /></Layout>} />
        <Route path="/contact-freelancer/:id" element={<ContactFreelancer />} />
        <Route path="/contact-client/:id" element={<FreelancerProfileLayout ><ContactClient/></FreelancerProfileLayout>} />
        <Route path="/inbox" element={<ClientInbox />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/project/:id/edit" element={<EditProjectPage />} />
        <Route path="/projects/:id/create-contract" element={<CreateContractPage />} />
        <Route path="/contract/:id/createdispute" element={<ClientLayout><DisputePage /></ClientLayout>} />
        <Route path="/update-dispute/:id" element={<ClientLayout><UpdateDispute /></ClientLayout>} />
        <Route path="/contract-disputes/:id" element={<ClientLayout><ContractDisputes /></ClientLayout>} />
        <Route path="/contract-dispute/:id/check" element={<ClientLayout><ContractDisputeDetails /></ClientLayout>} />        
        <Route path="/contract-disputeresponse/:id" element={<ClientLayout><ContractDisputeResponsePage /></ClientLayout>} />                
        <Route path="/counter-disputeresponse/:id" element={<ClientLayout><CounterDisputeResponsePage /></ClientLayout>} />                
        <Route path="/create-project" element={<CreateProjectPage />} />        
        <Route path="/hire-talent/talent-list" element={<ClientLayout><TalentListPage /></ClientLayout>} />
        <Route path="/hire-talent/talent-list/:id" element={<ClientLayout><FreelancerDetailPage /></ClientLayout>} />
        <Route path="/hire-talent/project-description" element={<ClientLayout><ProjectDescriptionPage /></ClientLayout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/services" element={<Layout><ServicePage /></Layout>} />
        <Route path="/clients" element={<Layout><ClientsPage /></Layout>} />
        <Route path="/notification" element={<ClientLayout><NotificationPage /></ClientLayout>} />
        <Route path="/message" element={<InterviewerLayout><NotificationPage /></InterviewerLayout>} />
        <Route path="/contracts" element={<ClientLayout><ContractsPage /></ClientLayout>} />
        <Route path="/contracts/:id" element={<ClientLayout><ContractDetailsPage /></ClientLayout>} />      
        <Route path="/contracts/:id/edit" element={<ClientLayout><EditContractPage /></ClientLayout>} />
        <Route path="/contract-counter-offers/:id" element={<ClientLayout><CounterOffers /></ClientLayout>} />
        <Route path="/contract-counter-offer/:id" element={<ClientLayout><CounterOffer /></ClientLayout>} />
        <Route path="/create-counter-offer/:id" element={<ClientLayout><CreateCounterOffer /></ClientLayout>} />        
        <Route path="/edit-offer/:id" element={<ClientLayout><EditCounterOfferPage /></ClientLayout>} />
        <Route path="/send-response/:id" element={<SendDisputeResponse/>} />
        <Route path="/home" element={<FreelancerProfileLayout><FreelancerDashboard /></FreelancerProfileLayout>} />
        <Route path="/myprojects" element={<FreelancerProfileLayout><ProjectListPage /></FreelancerProfileLayout>} />
        <Route path="/myprojects/:id" element={<FreelancerProfileLayout><ProjectDetails /></FreelancerProfileLayout>} />
        <Route path="/mycontracts" element={<FreelancerProfileLayout><ContractsList /></FreelancerProfileLayout>} />
        <Route path="/mycontracts/:id" element={<FreelancerProfileLayout><ContractDetails /></FreelancerProfileLayout>} />
        <Route path="/counter-offers/:id" element={<FreelancerProfileLayout><CounterOffersList /></FreelancerProfileLayout>} />        
        <Route path="/counter-offer/:id" element={<FreelancerProfileLayout><CounterOfferDetails /></FreelancerProfileLayout>} />        
        <Route path="/edit-counter-offer/:id" element={<FreelancerProfileLayout><EditCounterOffer /></FreelancerProfileLayout>} />        
        <Route path="/counter-response/:id" element={<FreelancerProfileLayout><DisputeResponseCounter /></FreelancerProfileLayout>} />                
        <Route path="/messages" element={<FreelancerInbox/>} />
        <Route path="/messages/:id" element={<FreelancerProfileLayout><ContactUser/></FreelancerProfileLayout>} />
        <Route path="/submit-counter-offer/:id" element={<FreelancerProfileLayout><SubmitCounterOffer /> </FreelancerProfileLayout>} />
        <Route path="/setting" element={<FreelancerProfileLayout><FreelancerSettingsPage /> </FreelancerProfileLayout>} />        
        <Route path="/update-profile" element={<FreelancerProfileLayout><UpdateProfilePage /> </FreelancerProfileLayout>} />              
        <Route path="/notifications" element={<FreelancerProfileLayout><NotificationPage /></FreelancerProfileLayout>} />
        <Route path="/dispute-response/:id" element={<FreelancerProfileLayout><DisputeResponsePage /></FreelancerProfileLayout>} />
        <Route path="/dispute-response/:id/edit" element={<FreelancerProfileLayout><EditDisputeResponsePage /></FreelancerProfileLayout>} />
        <Route path="/dispute/:id/edit" element={<FreelancerProfileLayout><EditDisputePage /></FreelancerProfileLayout>} />
        <Route path="/disputeresponse/:id" element={<FreelancerProfileLayout><DisputeResponseDetailsPage/></FreelancerProfileLayout>} />
        <Route path="/disputes/:id" element={<FreelancerProfileLayout><DisputesPage/></FreelancerProfileLayout>} />        
        <Route path="/dispute-details/:id" element={<FreelancerProfileLayout><DisputeDetails/></FreelancerProfileLayout>} />        
        <Route path="/skills" element={<FreelancerProfileLayout><SkillsPage/> </FreelancerProfileLayout>} />        
        <Route path="/new-test" element={<FreelancerProfileLayout><StartNewTestPage/> </FreelancerProfileLayout>} />                
        <Route path='/test-terminated' element={<FreelancerProfileLayout><TestTerminatedPage/> </FreelancerProfileLayout>} />                
        <Route path='/select-appointment' element={<FreelancerProfileLayout><SelectAppointmentDate/> </FreelancerProfileLayout>} />                
        <Route path='/appointment-details' element={<FreelancerProfileLayout><AppointmentDetailsPage/> </FreelancerProfileLayout>} />                
        <Route path='/verify-account' element={<FreelancerProfileLayout><VerifyAccountPage/> </FreelancerProfileLayout>} />                
        <Route path="/contractDispute/:id/createdispute" element={<FreelancerProfileLayout><ContractDisputePage /></FreelancerProfileLayout>} />
        <Route path='/verificatoin-steps' element={<FreelancerProfileLayout><LivelinessTest/> </FreelancerProfileLayout>} />                
        <Route path='/welcome' element={<InterviewerLayout><InterviewerDashboard/> </InterviewerLayout>} />                
        <Route path='/appointment/:id' element={<InterviewerLayout><AppointmentDetails/> </InterviewerLayout>} />                
        <Route path='/appointments' element={<InterviewerLayout><AppointmentsPage/> </InterviewerLayout>} />                
        <Route path='/interviews' element={<InterviewerLayout><InterviewsPage/> </InterviewerLayout>} />                
        <Route path='/interview/:id' element={<InterviewerLayout><InterviewPage/> </InterviewerLayout>} />                
        <Route path='/myprofile' element={<InterviewerLayout><UpdateInterviewerProfile/> </InterviewerLayout>} />                        
        <Route path='/latest-disputes' element={<DrcLayout><DisputeManagerDashboard/> </DrcLayout>} />                              
        <Route path='/dispute-events/:id' element={<DrcLayout><DisputeHistoryPage/> </DrcLayout>} />                              
        <Route path='/drc-dispute/:id' element={<DrcLayout><DrcDisputeDetails/> </DrcLayout>} />                              
        <Route path='/drc-dispute-response/:id' element={<DrcLayout><DrcDisputeResponseDetails/> </DrcLayout>} />                              
        <Route path='/resolve-dispute/:id' element={<DrcLayout><ResolveDispute/> </DrcLayout>} />                              
        <Route path='/drc-notification' element={<DrcLayout><NotificationPage/> </DrcLayout>} />                              
        <Route path='/drc-disputes' element={<DrcLayout><DrcForwardedDisputes/> </DrcLayout>} />                              
        <Route path='/drc-update-profile' element={<DrcLayout><UpdateDrcProfile/> </DrcLayout>} />                              
        <Route path='/drc-change-password' element={<DrcLayout><ChangePasswordPage/> </DrcLayout>} />                              
        <Route path='/drc-settings' element={<DrcLayout><DrcSettingsPage/> </DrcLayout>} />                              
        <Route path='/assessment/:id' element={<AssessmentLayout><AssessmentRoadmap/> </AssessmentLayout>} />                              
        <Route path='/assessment-notifications' element={<AssessmentLayout><NotificationPage/> </AssessmentLayout>} />                              
        <Route path='/assessments' element={<AssessmentLayout><AssessmentsPage/> </AssessmentLayout>} />                              

      </Routes>
  );
};

export default RoutesConfig;