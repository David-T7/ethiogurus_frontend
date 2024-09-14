import React from 'react';
import Routes from './routes';
import AuthProvider from './components/AuthContext';
import { BrowserRouter as Router,} from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import { ClientUserProvider } from './components/clientUserContext';
import { ProjectProvider } from './components/ProjectContext';
import { SkillTestProvider } from './components/SkillTestContext';
import { CameraProvider } from './components/freealncerpage/CameraContext';
const App = () => {
  return (
    <div className="App">
      {/* Wrap the Routes component with AuthProvider */}
      <Router>
      <CameraProvider>
      <SkillTestProvider>
      <ProjectProvider>
      <ClientUserProvider>
      <UserProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      </UserProvider>
      </ClientUserProvider>
      </ProjectProvider>
      </SkillTestProvider>
      </CameraProvider>
      </Router>
    </div>
  );
};

export default App;
