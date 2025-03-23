import React, { useState } from 'react';

const LegalAdvice = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    
    setIsSubmitting(true);
    setResponse(null);
    
    // Simulate AI response
    setTimeout(() => {
      setIsSubmitting(false);
      setResponse({
        answer: "Based on your question, I can provide some general guidance. However, please note that this is not a substitute for professional legal advice. I recommend consulting with a qualified attorney for your specific situation.",
        references: [
          "Section 10 of the Contract Act, 1872",
          "Consumer Protection Act, 2019"
        ]
      });
    }, 2000);
  };
  
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Get Legal Advice
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Ask questions and get guidance on legal matters
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select 
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="family">Family Law</option>
                <option value="property">Property Law</option>
                <option value="criminal">Criminal Law</option>
                <option value="civil">Civil Law</option>
                <option value="consumer">Consumer Rights</option>
                <option value="employment">Employment Law</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                Your Legal Question
              </label>
              <div className="mt-1">
                <textarea
                  id="query"
                  name="query"
                  rows="4"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe your legal issue or question in detail"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                ></textarea>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Be specific and include relevant details for the most accurate advice.
              </p>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting || !query}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isSubmitting || !query ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isSubmitting ? 'Processing...' : 'Get Advice'}
              </button>
            </div>
          </form>
          
          {response && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Legal Guidance</h4>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{response.answer}</p>
              </div>
              
              {response.references && response.references.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Relevant Legal References:</h5>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {response.references.map((ref, index) => (
                      <li key={index}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Disclaimer: This is general information and not specific legal advice. For detailed guidance on your matter, please consult with a qualified attorney.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalAdvice;