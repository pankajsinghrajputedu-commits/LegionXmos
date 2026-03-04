import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import Sidebar from '@/components/Sidebar';
import DarkModeToggle from '@/components/DarkModeToggle';
import AuthCallback from '@/components/AuthCallback';
import Landing from '@/pages/Landing';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import HiringsPage from '@/pages/HiringsPage';
import NewHiring from '@/pages/NewHiring';
import Assessments from '@/pages/Assessments';
import HiringWorkflow from '@/pages/HiringWorkflow';
import CandidateTest from '@/pages/CandidateTest';
import TestSubmitted from '@/pages/TestSubmitted';
import Scoring from '@/pages/Scoring';
import Leaderboard from '@/pages/Leaderboard';
import '@/App.css';

const AppContent = () => {
  const location = useLocation();
  const { isDark, isTransitioning } = useTheme();
  
  // Handle OAuth callback synchronously
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isTestPage = location.pathname.startsWith('/test/');
  const isTestSubmittedPage = location.pathname.startsWith('/test-submitted');
  const showSidebar = !isLandingPage && !isLoginPage && !isTestPage && !isTestSubmittedPage;
  const showDarkModeToggle = !isLandingPage && !isLoginPage && !isTestPage && !isTestSubmittedPage;

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Page transition overlay */}
      <div 
        className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-500 ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: isDark 
            ? 'radial-gradient(circle at bottom right, rgba(30, 58, 95, 0.8) 0%, transparent 70%)' 
            : 'radial-gradient(circle at bottom right, rgba(251, 191, 36, 0.5) 0%, transparent 70%)'
        }}
      />
      
      {showSidebar && <Sidebar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          <Route path="/hirings" element={<HiringsPage />} />
          <Route path="/new-hiring" element={<NewHiring />} />
          <Route path="/hiring" element={<HiringWorkflow />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/test/:linkId" element={<CandidateTest />} />
          <Route path="/test-submitted" element={<TestSubmitted />} />
          <Route path="/scoring" element={<Scoring />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
      {showDarkModeToggle && <DarkModeToggle />}
      <Toaster position="top-right" theme={isDark ? 'dark' : 'light'} />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
