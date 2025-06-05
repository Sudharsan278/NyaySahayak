import React, { useState, useEffect } from 'react';
import { Scale, FileText, Users, Mail, Phone, CheckCircle, ArrowRight, Heart, Shield, Lightbulb } from 'lucide-react';

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const offerings = [
    {
      icon: FileText,
      title: "Document Analysis",
      description: "Intelligent analysis and interpretation of legal documents"
    },
    {
      icon: Lightbulb,
      title: "Legal Guidance",
      description: "Personalized advice tailored to your specific legal needs"
    },
    {
      icon: Scale,
      title: "Legal Database",
      description: "Comprehensive access to acts, statutes, and legal precedents"
    },
    {
      icon: Shield,
      title: "Simplified Explanations",
      description: "Complex legal concepts made easy to understand"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Accessibility",
      description: "Making legal information available to everyone, regardless of background"
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your legal matters are handled with utmost confidentiality"
    },
    {
      icon: Scale,
      title: "Justice for All",
      description: "Democratizing access to legal knowledge and empowerment"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-100/50 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-100/30 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className={`text-center py-20 px-6 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-center mb-8">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-lg">
              <Scale className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-6 tracking-tight">
            About <span className="font-semibold">NyaySahayak</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Your trusted companion in navigating the complexities of legal matters with confidence and clarity
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          
          <div className={`mb-20 transform transition-all duration-1000 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300">
                    <Scale className="w-8 h-8 text-slate-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-semibold text-slate-900 mb-6">Our Mission</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  NyaySahayak is a comprehensive legal assistance platform designed to help individuals 
                  navigate the complexities of the legal system. Our mission is to make legal 
                  information accessible, understandable, and actionable for everyone, democratizing 
                  access to justice and empowering individuals to understand their rights.
                </p>
              </div>
            </div>
          </div>

          <div className={`mb-20 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-slate-900 mb-4">What We Offer</h2>
              <p className="text-slate-600 text-lg">Comprehensive legal assistance tailored to your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {offerings.map((offering, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                  style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                >
                  <div className="group relative">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden h-full">
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10 text-center">
                        <div className="mb-6 transform group-hover:scale-105 transition-transform duration-300">
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-slate-900 transition-colors duration-300">
                            <offering.icon className="w-7 h-7 text-slate-600 group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors duration-300">
                          {offering.title}
                        </h3>
                        
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {offering.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`mb-20 transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-slate-900 mb-4">Our Values</h2>
              <p className="text-slate-600 text-lg">The principles that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                  style={{ transitionDelay: `${(index + 8) * 100}ms` }}
                >
                  <div className="group relative">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden h-full">
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10">
                        <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300">
                            <value.icon className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors duration-300" />
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-slate-800 transition-colors duration-300">
                          {value.title}
                        </h3>
                        
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`mb-20 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300">
                    <Users className="w-10 h-10 text-slate-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors duration-300">
                    Our Team
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    NyaySahayak is developed by a dedicated team of legal experts, technologists, and accessibility 
                    advocates committed to bridging the gap between legal professionals and the public. We combine 
                    deep legal knowledge with cutting-edge technology to create solutions that truly serve people's needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`transform transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-semibold text-white mb-4">Get in Touch</h3>
                  <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
                    Have questions or feedback about NyaySahayak? We'd love to hear from you. 
                    Our team is here to help and support your legal journey.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm font-medium">Email Us</p>
                        <p className="text-white font-semibold">support@nyaysahayak.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm font-medium">Call Us</p>
                        <p className="text-white font-semibold">+91-123-456-7890</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`text-center mt-12 transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-slate-600 font-medium">
                Serving Justice • Building Trust • Empowering People
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 right-8 opacity-5 animate-float">
        <Scale className="w-32 h-32 text-slate-400" />
      </div>
      
      <div className="absolute bottom-1/4 left-8 opacity-5 animate-float-reverse">
        <FileText className="w-24 h-24 text-slate-400" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default About;