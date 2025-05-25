import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../assets/justice-scale.png';
import axios from 'axios';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("Decoded obj ", decoded);
    console.log(decoded.email);
    localStorage.clear();
    localStorage.setItem('Logged in user', JSON.stringify({
      email : decoded.email,
      name : decoded.name
    }));

    
    const userData = {
      first_name: decoded.given_name,
      last_name: decoded.family_name,
      email: decoded.email,
      picture: decoded.picture
    };
    
    const saveUser = async (userData) => {
      try{
        
        const response = await axios.post("http://localhost:8080/api/users/saveUser", userData);
        console.log(response.data);
        navigate("/dashboard");
      
      }catch(error){

        if(error.response){
          console.log("Error in saving the user", error.response.data);
        }else if(error.request){
          console.error('No response from server:', error.request);
        }else{
          console.error('Error:', error.message);
        }
      }
    }
    
    saveUser(userData);
  };

  const handleGoogleError = () => {
    console.log("Login failed!");
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <nav className="fixed w-full z-50 bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white text-xl font-bold drop-shadow-sm">न्</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">NyaySahayak</h1>
              </motion.div>
            </div>
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                <span className="text-blue-600">AI-Powered</span> Legal Assistance for Everyone
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                NyaySahayak empowers economically challenged individuals with accessible legal advice, 
                education on Indian articles, and multilingual document understanding.
              </p>
              <div className="mt-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out"
                >
                  Continue with Google
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-64 md:h-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white rounded-3xl flex items-center justify-center shadow-xl">
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotateZ: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                  className="w-40 h-40 md:w-64 md:h-64"
                >
                  <img src={heroImage} className='w-full h-full rounded-full bg-gradient-to-br items-center justify-center shadow-lg'/>

                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: scrollY > 100 ? 1 : 0, y: scrollY > 100 ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900">Innovative Features</h2>
            <p className="mt-4 text-lg text-gray-600">Bringing legal assistance to those who need it most</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: scrollY > 200 ? 1 : 0, y: scrollY > 200 ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-blue-50 rounded-xl p-6 shadow-md"
            >
              <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Legal Advice</h3>
              <p className="text-gray-600">
                Get instant legal guidance powered by advanced AI technology, tailored to your specific situation.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: scrollY > 200 ? 1 : 0, y: scrollY > 200 ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-blue-50 rounded-xl p-6 shadow-md"
            >
              <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multilingual Support</h3>
              <p className="text-gray-600">
                Understand legal documents in your preferred language with our Sarvam API integration.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: scrollY > 200 ? 1 : 0, y: scrollY > 200 ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-blue-50 rounded-xl p-6 shadow-md"
            >
              <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Community</h3>
              <p className="text-gray-600">
                Connect with legal advocates to get your questions answered by professionals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: scrollY > 500 ? 1 : 0, y: scrollY > 500 ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Simple steps to get the legal assistance you need</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: scrollY > 600 ? 1 : 0, y: scrollY > 600 ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center"
            >
              <div className="mx-auto h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign In</h3>
              <p className="text-gray-600">
                Create your account with a simple Google login to access all features.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: scrollY > 600 ? 1 : 0, y: scrollY > 600 ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <div className="mx-auto h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ask Questions</h3>
              <p className="text-gray-600">
                Describe your legal concerns or upload documents for analysis.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: scrollY > 600 ? 1 : 0, y: scrollY > 600 ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Support</h3>
              <p className="text-gray-600">
                Receive instant AI guidance or connect with legal professionals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: scrollY > 900 ? 1 : 0, y: scrollY > 900 ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900">User Testimonials</h2>
            <p className="mt-4 text-lg text-gray-600">See how NyaySahayak is making a difference</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: scrollY > 1000 ? 1 : 0, y: scrollY > 1000 ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-blue-50 p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">RK</div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Rajesh Kumar</h4>
                  <p className="text-gray-600">Small Business Owner, Chennai</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "NyaySahayak helped me understand my business registration documents in Tamil. The AI explained every section clearly and saved me expensive legal consultation fees."
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: scrollY > 1000 ? 1 : 0, y: scrollY > 1000 ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-blue-50 p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">AP</div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Anjali Patel</h4>
                  <p className="text-gray-600">Student, Ahmedabad</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "As a law student, I use NyaySahayak to learn about Indian articles in a simple language. The community feature also helped me connect with practicing advocates for guidance."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: scrollY > 1300 ? 1 : 0, y: scrollY > 1300 ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
            <p className="mt-4 text-xl text-blue-100">
              Join NyaySahayak today and access legal assistance in your language
            </p>
            <div className="mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-50 transition duration-300 ease-in-out"
              >
                Continue with Google
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white text-xl font-bold drop-shadow-sm">न्</span>
                </div>
                <h3 className="text-2xl font-bold">NyaySahayak</h3>
              </div>
              <p className="mt-2 text-gray-400">
                Empowering access to justice through technology
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h4 className="text-lg font-semibold mb-4">Features</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">AI Legal Advice</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Document Analysis</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Community Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Legal Encyclopedia</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NyaySahayak. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white text-xl font-bold drop-shadow-sm">न्</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">NyaySahayak</h3>
              </div>
              <p className="text-gray-600">
                Sign in to access personalized legal assistance
              </p>
            </div>
            <div className="flex flex-col items-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
                width="240"
                theme="filled_blue"
                shape="circle"
                text="continue_with"
                locale="en"
                useOneTap
              />
              <p className="mt-6 text-sm text-gray-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;