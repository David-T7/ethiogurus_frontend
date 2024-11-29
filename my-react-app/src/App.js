import React from 'react';
import Routes from './routes';
import AuthProvider from './components/AuthContext';
import { BrowserRouter as Router,} from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import { ClientUserProvider } from './components/clientUserContext';
import { ProjectProvider } from './components/ProjectContext';
import { SkillTestProvider } from './components/SkillTestContext';
import { CameraProvider } from './components/freealncerpage/CameraContext';
import { InterviewerUserProvider } from './components/interviewerUserContext';
import { DisputeMangerUserProvider } from './components/DisputeManagerContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const App = () => {
  return (
    <div className="App">
      {/* Wrap the Routes component with AuthProvider */}
      <QueryClientProvider client={queryClient}>
      <Router>
      <CameraProvider>
      <SkillTestProvider>
      <ProjectProvider>
      <ClientUserProvider>
      <UserProvider>
      <AuthProvider>
      <InterviewerUserProvider>
      <DisputeMangerUserProvider>
        <Routes />
      </DisputeMangerUserProvider>
      </InterviewerUserProvider>
      </AuthProvider>
      </UserProvider>
      </ClientUserProvider>
      </ProjectProvider>
      </SkillTestProvider>
      </CameraProvider>
      </Router>
      </QueryClientProvider>
    </div>
  );
};

export default App;
