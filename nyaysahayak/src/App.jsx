import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import About from "./pages/About";
import UploadDocument from "./pages/UploadDocument";
import LegalAdvice from "./pages/LegalAdvice";
import Acts from "./pages/Acts";
import Navbar from './components/Navbar';
import LandingPage from './components/auth/LandingPage';

const ProtectedRoute = ({ children }) => {
  // const user = JSON.parse(localStorage.getItem('nyaysahayak_user'));
  // if (!user) {
  //    return <Navigate to="/" replace />;
  // }
  return children;
};

// Wrapper to use `useLocation` in Router scope
const AppWrapper = () => {
  const location = useLocation();

  // Don't show Navbar on landing page
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
               <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <UploadDocument />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/advice" 
          element={
            <ProtectedRoute>
              <LegalAdvice />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/acts" 
          element={
            <ProtectedRoute>
              <Acts />
            </ProtectedRoute>
          } 
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
