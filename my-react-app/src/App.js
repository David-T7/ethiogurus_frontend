import React from 'react';
import Routes from './routes';
import AuthProvider from './components/AuthContext';
import { BrowserRouter as Router,} from 'react-router-dom';
import { UserProvider } from './components/UserContext';
const App = () => {
  return (
    <div className="App">
      {/* Wrap the Routes component with AuthProvider */}
      <Router>
      <UserProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      </UserProvider>
      </Router>
    </div>
  );
};

export default App;
