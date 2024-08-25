import React from 'react';
import Routes from './routes';
import AuthProvider from './components/AuthContext';
import { BrowserRouter as Router,} from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import { ClientUserProvider } from './components/clientUserContext';
import { ProjectProvider } from './components/ProjectContext';
const App = () => {
  return (
    <div className="App">
      {/* Wrap the Routes component with AuthProvider */}
      <Router>
      <ProjectProvider>
      <ClientUserProvider>
      <UserProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      </UserProvider>
      </ClientUserProvider>
      </ProjectProvider>
      </Router>
    </div>
  );
};

export default App;
