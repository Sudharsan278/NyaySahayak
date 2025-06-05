import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, BookOpen, Scale, User, FileText, Shield, Gavel, Users, Building, ShoppingCart, Briefcase, ArrowRight } from 'lucide-react';

const LegalAdvice = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSubmitting(true);
    setResponse(null);
    
    try {
      const response = await fetch('http://localhost:8080/api/groq/get-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          category: category
        })
      });
      
      const data = await response.json();
      console.log(data.answer)
      setResponse({
        answer: data.answer,
        references: data.references || []
      });
    } catch (error) {
      console.error('Error:', error);
      setResponse({
        answer: "Sorry, I encountered an error while processing your request. Please try again.",
        references: []
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const parseResponse = (responseText) => {
    if (!responseText) return null;
    
    const sections = {
      legalGuidance: '',
      legalProvisions: '',
      nextSteps: '',
      disclaimer: ''
    };
    
    const lines = responseText.split('\n');
    let currentSection = 'legalGuidance';
    
    for (let line of lines) {
      const lowerLine = line.toLowerCase().trim();
      
      if (lowerLine.includes('legal guidance') || lowerLine.startsWith('legal guidance')) {
        currentSection = 'legalGuidance';
        continue;
      } else if (lowerLine.includes('relevant legal provisions') || lowerLine.startsWith('legal provisions') || lowerLine.includes('2.')) {
        currentSection = 'legalProvisions';
        continue;
      } else if (lowerLine.includes('next steps') || lowerLine.startsWith('next steps')) {
        currentSection = 'nextSteps';
        continue;
      } else if (lowerLine.includes('disclaimer') || lowerLine.startsWith('disclaimer') || lowerLine.startsWith('important')) {
        currentSection = 'disclaimer';
        continue;
      }
      
      if (line.trim()) {
        sections[currentSection] += line + '\n';
      }
    }
    
    if (!sections.legalGuidance && !sections.legalProvisions && !sections.nextSteps) {
      sections.legalGuidance = responseText;
    }
    
    return sections;
  };

  const parsedResponse = response ? parseResponse(response.answer) : null;
  
  return (
    <div className="bg-gray-50 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className={`mb-12 transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-center mb-8">
            <div className="bg-slate-900 p-4 rounded-xl shadow-sm">
              <Scale className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-4 tracking-tight">
              Legal <span className="font-semibold">Advisory</span>
            </h1>
            <p className="text-slate-500 leading-relaxed">
              Professional legal guidance tailored to your specific situation
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} delay-100`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Select Practice Area</h3>
                    <p className="text-sm text-slate-500">Choose the legal category that best fits your query</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { value: 'family', label: 'Family Law', icon: Users },
                    { value: 'property', label: 'Property Law', icon: Building },
                    { value: 'criminal', label: 'Criminal Law', icon: Gavel },
                    { value: 'civil', label: 'Civil Law', icon: Scale },
                    { value: 'consumer', label: 'Consumer Rights', icon: ShoppingCart },
                    { value: 'employment', label: 'Employment Law', icon: Briefcase }
                  ].map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`group relative p-4 rounded-xl border transition-all duration-300 text-left hover:-translate-y-1 ${
                          category === cat.value
                            ? 'border-slate-900 bg-slate-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-3 text-center">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                            category === cat.value 
                              ? 'bg-slate-900 text-white' 
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className={`font-medium text-sm transition-colors duration-300 ${
                            category === cat.value ? 'text-slate-900' : 'text-slate-700'
                          }`}>
                            {cat.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} delay-200`}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mr-4">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Describe Your Legal Question</h3>
                    <p className="text-sm text-slate-500">Provide detailed information for accurate guidance</p>
                  </div>
                </div>
                
                <div className="relative">
                  <textarea
                    id="query"
                    name="query"
                    rows={8}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all duration-200 resize-none text-slate-900 placeholder-slate-400"
                    placeholder="Please provide detailed information about your legal issue. Include relevant facts, dates, locations, and any specific concerns you have. The more context you provide, the more accurate and helpful our guidance will be..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    required
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-slate-400">
                    {query.length}/2000
                  </div>
                </div>
                
                <div className="flex items-start bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl mt-4">
                  <AlertTriangle className="w-4 h-4 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-blue-800">
                    Include specific details, dates, and circumstances for the most accurate legal guidance.
                  </span>
                </div>
              </div>

              <div className={`flex justify-center transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} delay-300`}>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !query || !category}
                  className={`group px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
                    isSubmitting || !query || !category
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Analyzing Your Query...</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-5 h-5" />
                      <span>Get Legal Advice</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} delay-400`}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Why Choose Us?</h3>
                </div>
                <div className="space-y-3">
                  {[
                    'AI-powered legal analysis',
                    'Expert guidance in minutes',
                    'Comprehensive legal references',
                    'Actionable next steps'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center text-slate-600">
                      <div className="w-2 h-2 bg-slate-900 rounded-full mr-3"></div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} delay-500`}>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Tips</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• Be as specific as possible about your situation</p>
                  <p>• Include relevant dates and locations</p>
                  <p>• Mention any documents or evidence you have</p>
                  <p>• Describe what outcome you're seeking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {parsedResponse && (
          <div className="max-w-6xl mx-auto mt-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Legal Analysis Complete</h2>
                  <p className="text-slate-500">Professional guidance tailored to your situation</p>
                </div>
              </div>
              
              <div className="space-y-8">
                {parsedResponse.legalGuidance && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Scale className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">Legal Guidance & Analysis</h3>
                        <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {parsedResponse.legalGuidance.trim()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {parsedResponse.legalProvisions && (
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-purple-900 mb-3">Relevant Legal Provisions</h3>
                        <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {parsedResponse.legalProvisions.trim()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {parsedResponse.nextSteps && (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-900 mb-3">Recommended Action Plan</h3>
                        <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                          {parsedResponse.nextSteps.trim()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {response.references && response.references.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center mr-3">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">Legal References & Citations</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {response.references.map((ref, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-slate-600" />
                            </div>
                            <span className="text-sm text-slate-700 leading-relaxed">{ref}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-amber-900 mb-3">Important Legal Disclaimer</h3>
                      <div className="bg-white/60 rounded-lg p-4 mb-4">
                        <p className="text-amber-800 leading-relaxed">
                          {parsedResponse.disclaimer ? parsedResponse.disclaimer.trim() : 
                            "This analysis provides general legal information and educational content only. It does not constitute specific legal advice tailored to your individual circumstances."
                          }
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-amber-700">
                        {[
                          'Consult a qualified attorney for personalized advice',
                          'Laws vary by jurisdiction and circumstances',
                          'No attorney-client relationship established',
                          'Time-sensitive legal matters require immediate action'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default LegalAdvice;