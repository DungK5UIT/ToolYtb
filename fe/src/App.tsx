import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import { ChannelManagementPage } from './pages/ChannelManagement'; 
import AllVideosPage from './pages/AllVideos';
import SettingsPage from './pages/Settings';
import ApiKeyPage from './pages/ApiKeyPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProtectedLayoutProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ isLoggedIn, onLogout }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout onLogout={onLogout} />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />
        <Route element={<ProtectedLayout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/channels" element={<ChannelManagementPage />} />
          <Route path="/videos" element={<AllVideosPage />} />
          <Route path="/api-keys" element={<ApiKeyPage />} />
          <Route path="/settings" element={<SettingsPage />} />ß
        </Route>

        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={handleLogin} />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;