import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/auth/Login';
import Dashboard from './components/Dashboard';
import About from "./pages/About";
import UploadDocument from "./pages/UploadDocument";
import LegalAdvice from "./pages/LegalAdvice";
import Acts from "./pages/Acts";
import Navbar from './components/Navbar';


// Protected route component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('nyayasathi_user'));
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Independent Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/advice" element={<LegalAdvice />} />
        <Route path="/acts" element={<Acts />} />
      </Routes>
    </Router>
  );
}


export default App;
