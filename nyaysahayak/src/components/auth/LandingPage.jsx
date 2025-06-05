import React, { useState, useEffect } from 'react';
import { Scale, Globe, Users, ArrowRight, CheckCircle, Sparkles, Shield, BookOpen, X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    setTimeout(() => setIsLoaded(true), 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <div className="bg-gray-50 min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 transition-all duration-300 hover:bg-white/90">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <div className={`flex items-center transform transition-all duration-1000 hover:scale-105 cursor-pointer ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="bg-slate-900 p-2 rounded-xl shadow-sm mr-3 transition-all duration-300 hover:bg-slate-800 hover:shadow-md">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 transition-colors duration-300 hover:text-slate-700">
                  NyaySahayak
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className={`bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-6 rounded-xl shadow-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex items-center mb-6 group cursor-pointer">
                <Sparkles className="w-5 h-5 text-slate-600 mr-2 transition-all duration-300 group-hover:text-slate-900 group-hover:scale-110" />
                <span className="text-slate-600 font-medium text-sm transition-colors duration-300 group-hover:text-slate-900">AI-Powered Legal Revolution</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-light leading-tight mb-6 text-slate-900 tracking-tight hover:text-slate-700 transition-colors duration-500 cursor-default">
                Legal Justice
                <br />
                <span className="font-semibold">for Everyone</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed font-light hover:text-slate-700 transition-colors duration-300 cursor-default">
                Empowering economically challenged individuals with AI-driven legal assistance, 
                multilingual document understanding, and expert community support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 px-8 rounded-xl shadow-sm transition-all duration-300 flex items-center justify-center group transform hover:scale-105 hover:shadow-lg active:scale-95"
                >
                  Continue with Google
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
            
            <div className={`relative transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="relative group cursor-pointer">
                <div className="w-full h-80 md:h-96 bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent group-hover:from-slate-100/70 transition-all duration-500"></div>
                  <Scale className="w-32 h-32 text-slate-400 transition-all duration-500 group-hover:text-slate-600 group-hover:scale-110" />
                </div>
                
                <div className="absolute -top-6 -right-6 bg-slate-900 p-3 rounded-xl shadow-lg transition-all duration-300 hover:bg-slate-800 hover:scale-110 hover:shadow-xl cursor-pointer">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-slate-900 p-3 rounded-xl shadow-lg transition-all duration-300 hover:bg-slate-800 hover:scale-110 hover:shadow-xl cursor-pointer">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${scrollY > 100 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-4xl font-light text-slate-900 mb-4 tracking-tight hover:text-slate-700 transition-colors duration-300 cursor-default">
              Revolutionary <span className="font-semibold">Features</span>
            </h2>
            <p className="text-xl text-slate-600 font-light hover:text-slate-700 transition-colors duration-300 cursor-default">Transforming legal accessibility with cutting-edge technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="h-8 w-8 text-slate-600" />,
                title: "AI-Powered Legal Advice",
                description: "Get instant, personalized legal guidance powered by advanced AI technology tailored to your specific situation and needs."
              },
              {
                icon: <Globe className="h-8 w-8 text-slate-600" />,
                title: "Multilingual Support",
                description: "Understand complex legal documents in your preferred language with our advanced Sarvam API integration system."
              },
              {
                icon: <Users className="h-8 w-8 text-slate-600" />,
                title: "Expert Community",
                description: "Connect directly with verified legal advocates and professionals to get your questions answered by experts."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group transform transition-all duration-700 cursor-pointer ${scrollY > 200 ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-gray-50 hover:bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 h-full">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <div className="group-hover:text-white transition-all duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-light group-hover:text-slate-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 relative">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${scrollY > 500 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-4xl font-light text-slate-900 mb-4 tracking-tight hover:text-slate-700 transition-colors duration-300 cursor-default">
              How It <span className="font-semibold">Works</span>
            </h2>
            <p className="text-xl text-slate-600 font-light hover:text-slate-700 transition-colors duration-300 cursor-default">Three simple steps to access legal assistance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign In Securely",
                description: "Create your account with Google's secure authentication to access all premium features and personalized assistance."
              },
              {
                step: "02", 
                title: "Ask Questions",
                description: "Describe your legal concerns in detail or upload important documents for comprehensive AI-powered analysis."
              },
              {
                step: "03",
                title: "Get Expert Support", 
                description: "Receive instant AI guidance or connect directly with verified legal professionals for specialized assistance."
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`text-center group cursor-pointer transform transition-all duration-700 hover:scale-105 ${scrollY > 600 ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="mx-auto h-20 w-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-semibold mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-xl group-hover:bg-slate-800 transition-all duration-300">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gray-200 transform translate-x-4 group-hover:bg-slate-300 transition-colors duration-300"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-xs mx-auto font-light group-hover:text-slate-700 transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${scrollY > 900 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-4xl font-light text-slate-900 mb-4 tracking-tight hover:text-slate-700 transition-colors duration-300 cursor-default">
              Making Impact <span className="font-semibold">Across India</span>
            </h2>
            <p className="text-xl text-slate-600 font-light hover:text-slate-700 transition-colors duration-300 cursor-default">Transforming lives through accessible legal assistance</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Users Assisted", icon: <Users className="w-8 h-8" /> },
              { number: "25+", label: "Languages Supported", icon: <Globe className="w-8 h-8" /> },
              { number: "10K+", label: "Documents Analyzed", icon: <BookOpen className="w-8 h-8" /> },
              { number: "95%", label: "Success Rate", icon: <CheckCircle className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center group cursor-pointer transform transition-all duration-700 hover:scale-110 ${scrollY > 1000 ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="bg-gray-50 hover:bg-slate-900 rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group hover:-translate-y-1">
                  <div className="text-slate-600 group-hover:text-white mb-4 flex justify-center group-hover:scale-125 transition-all duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-semibold text-slate-900 group-hover:text-white mb-2 transition-colors duration-300">
                    {stat.number}
                  </div>
                  <p className="text-slate-600 group-hover:text-white font-medium transition-colors duration-300">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 relative">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`text-center transform transition-all duration-1000 ${scrollY > 1300 ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight hover:text-gray-200 transition-colors duration-300 cursor-default">
              Ready to Transform Your <span className="font-semibold">Legal Journey?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light hover:text-slate-200 transition-colors duration-300 cursor-default">
              Join thousands of users who are already accessing justice through our AI-powered platform
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-slate-900 font-medium py-4 px-8 rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-300 flex items-center justify-center group mx-auto hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Continue with Google
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl border border-gray-200 relative transform transition-all duration-300 scale-100 hover:scale-105">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4 group">
                <div className="bg-slate-900 p-3 rounded-xl shadow-sm mr-3 group-hover:scale-110 group-hover:bg-slate-800 transition-all duration-300">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors duration-300">
                  NyaySahayak
                </h3>
              </div>
              <p className="text-slate-600 font-light hover:text-slate-700 transition-colors duration-300">
                Sign in to access personalized legal assistance
              </p>
            </div>
            
            <div className="flex flex-col items-center">
               <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
                width="240"
                theme="filled_black"
                shape="circle"
                text="continue_with"
                locale="en"
                useOneTap
              />
                <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              <p className="text-sm text-slate-500 text-center font-light hover:text-slate-600 transition-colors duration-300">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;