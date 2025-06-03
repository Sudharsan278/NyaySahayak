import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle, BookOpen, Upload, ArrowRight, Scale } from 'lucide-react';

const DashboardHome = () => {
  
  const user = JSON.parse(localStorage.getItem('Logged in user')); 
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const cards = [
    {
      title: 'Upload Documents',
      description: 'Upload legal documents for analysis and assistance',
      icon: Upload,
      action: 'Upload Now',
      delay: 'delay-100',
      link: '/upload'
    },
    {
      title: 'Get Legal Advice',
      description: 'Ask questions and receive guidance on legal matters',
      icon: MessageCircle,
      action: 'Get Advice',
      delay: 'delay-200',
      link: '/advice'
    },
    {
      title: 'Legal Acts & Statutes',
      description: 'Browse and search through important legal acts',
      icon: BookOpen,
      action: 'View Acts',
      delay: 'delay-300',
      link: '/acts'
    }
  ];

  return (
    <div className="bg-gray-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className={`mb-16 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-center mb-8">
            <div className="bg-slate-900 p-4 rounded-xl shadow-sm">
              <Scale className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-4 tracking-tight">
              Welcome to <span className="font-semibold">NyaySahayak</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-6 font-light">
              Hello, <span className="text-slate-900 font-medium">{user.name}</span>
            </p>
            
            <p className="text-slate-500 leading-relaxed">
              Your personal legal assistant
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} ${card.delay}`}
            >
              <div className="group relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden">
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="mb-6 transform group-hover:scale-105 transition-transform duration-300">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300">
                        <card.icon className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors duration-300">
                      {card.title}
                    </h3>

                    <p className="text-slate-600 mb-8 leading-relaxed text-sm">
                      {card.description}
                    </p>

                    <Link to={card.link} className="block">
                      <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:gap-4 text-sm">
                        <span>{card.action}</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-20 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-slate-600 font-medium">
              Secure & Confidential Legal Assistance
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-32 right-8 opacity-5 animate-float">
        <Scale className="w-24 h-24 text-slate-400" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;