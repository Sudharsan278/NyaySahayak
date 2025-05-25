import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, BookOpen, Scale, User, FileText } from 'lucide-react';

const LegalAdvice = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  
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
    
    // Split the response into sections based on common patterns
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
    
    // If no clear sections found, put everything in legal guidance
    if (!sections.legalGuidance && !sections.legalProvisions && !sections.nextSteps) {
      sections.legalGuidance = responseText;
    }
    
    return sections;
  };

  const parsedResponse = response ? parseResponse(response.answer) : null;
  
  return (
    <div className="bg-white shadow-xl sm:rounded-xl">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
        <div className="flex items-center space-x-3">
          <Scale className="h-8 w-8 text-white" />
          <div>
            <h3 className="text-2xl font-bold text-white">
              Legal Advisory Service
            </h3>
            <p className="mt-1 text-blue-100">
              Get expert guidance on your legal matters
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Legal Category
              </label>
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="family">👨‍👩‍👧‍👦 Family Law</option>
                <option value="property">🏠 Property Law</option>
                <option value="criminal">⚖️ Criminal Law</option>
                <option value="civil">📋 Civil Law</option>
                <option value="consumer">🛡️ Consumer Rights</option>
                <option value="employment">💼 Employment Law</option>
                <option value="other">📝 Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="query" className="block text-sm font-semibold text-gray-700 mb-2">
              Describe Your Legal Question
            </label>
            <textarea
              id="query"
              name="query"
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Please provide detailed information about your legal issue. Include relevant facts, dates, and any specific concerns you have..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <p className="mt-2 text-sm text-gray-600 flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Be specific and include relevant details for the most accurate advice.
            </p>
          </div>
          
          <div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !query}
              className={`w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 ${
                isSubmitting || !query 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing Your Query...
                </>
              ) : (
                <>
                  <Scale className="h-5 w-5 mr-2" />
                  Get Legal Advice
                </>
              )}
            </button>
          </div>
        </div>
        
        {parsedResponse && (
          <div className="mt-12 space-y-8">
            <div className="border-t-4 border-blue-500 pt-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-7 w-7 text-green-500 mr-3" />
                Legal Analysis & Guidance
              </h4>
              
              {/* Legal Guidance Section */}
              {parsedResponse.legalGuidance && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Scale className="h-6 w-6 text-blue-600 mt-1" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-blue-900 mb-3">Legal Guidance</h5>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {parsedResponse.legalGuidance.trim()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Legal Provisions Section */}
              {parsedResponse.legalProvisions && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border border-purple-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-purple-600 mt-1" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-purple-900 mb-3">Relevant Legal Provisions</h5>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {parsedResponse.legalProvisions.trim()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Next Steps Section */}
              {parsedResponse.nextSteps && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <User className="h-6 w-6 text-green-600 mt-1" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold text-green-900 mb-3">Recommended Next Steps</h5>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {parsedResponse.nextSteps.trim()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* References Section */}
              {response.references && response.references.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-600 mr-2" />
                    Legal References
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {response.references.map((ref, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                        <span className="text-sm text-gray-700 font-medium">{ref}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Disclaimer Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-l-4 border-amber-400">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-semibold text-amber-900 mb-2">Important Legal Disclaimer</h5>
                    <p className="text-amber-800 leading-relaxed">
                      {parsedResponse.disclaimer ? parsedResponse.disclaimer.trim() : 
                        "This is general legal information and not specific legal advice tailored to your situation. Laws vary by jurisdiction and circumstances. For personalized legal guidance and representation, please consult with a qualified attorney who can review the specific details of your case."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalAdvice;