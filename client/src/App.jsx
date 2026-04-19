import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Dashboard from './pages/Dashboard';
import GuardManagement from './pages/GuardManagement';
import EventBuilder from './pages/EventBuilder';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <SocketProvider>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/guards" element={<GuardManagement />} />
                  <Route path="/builder" element={<EventBuilder />} />
                  <Route path="/builder/:eventId" element={<EventBuilder />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </SocketProvider>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
