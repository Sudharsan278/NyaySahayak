import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ActDetailView from '../components/ActDetailView.jsx';

const Acts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActId, setSelectedActId] = useState(null);
  
  // Fetch acts from the backend API
  useEffect(() => {
    const fetchActs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/acts');
        
        // Check if response is OK
        if (!response.ok) {
          throw new Error(`Failed to fetch acts: ${response.status} ${response.statusText}`);
        }
        
        // Check content type to avoid parsing non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response from server');
        }
        
        const data = await response.json();
        setActs(data);
      } catch (err) {
        console.error('Error fetching acts:', err);
        setError(err.message || 'Failed to load acts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActs();
  }, []);
  
  // Filter acts based on search term and category
  const filteredActs = acts.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (act.summary && act.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (act.keyProvisions && act.keyProvisions.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = category === 'all' || 
                          (act.category && act.category.toLowerCase() === category.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Handle view details click
  const handleViewDetails = (actId) => {
    setSelectedActId(actId);
  };

  // Close detail view
  const handleCloseDetails = () => {
    setSelectedActId(null);
  };

  // Get selected act data
  const selectedAct = acts.find(act => act.id === selectedActId);

  // Animation variants for list items
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="bg-indigo-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-indigo-800 p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-white text-2xl font-bold">Legal Acts & Statutes</h1>
            <p className="text-indigo-200">Browse and search through important legal acts and statutes of India</p>
          </div>
          
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 rounded-full absolute border-4 border-solid border-indigo-300"></div>
              <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-solid border-white border-t-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-indigo-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-indigo-800 p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-white text-2xl font-bold">Legal Acts & Statutes</h1>
            <p className="text-indigo-200">Browse and search through important legal acts and statutes of India</p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-indigo-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Main content area */}
        <div className="bg-indigo-800 p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-white text-2xl font-bold">Legal Acts & Statutes</h1>
          <p className="text-indigo-200">Browse and search through important legal acts and statutes of India</p>
        </div>
      
        {/* Search and filter area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <label htmlFor="search" className="block text-white text-sm font-medium mb-2">Search Acts</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by title or keywords"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-white text-sm font-medium mb-2">Category</label>
            <select
              id="category"
              name="category"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="constitutional">Constitutional</option>
              <option value="criminal">Criminal</option>
              <option value="civil">Civil</option>
              <option value="governance">Governance</option>
            </select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="text-white text-lg font-medium mb-4">
          Found {filteredActs.length} acts
        </div>
        
        {/* Acts list */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredActs.map((act) => (
            <motion.div 
              key={act.id}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-indigo-600">{act.title}</h2>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {act.category}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Year: {act.year}
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {act.summary ? (act.summary.length > 150 ? act.summary.substring(0, 150) + '...' : act.summary) : ''}
                </p>
                
                {act.tags && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {act.tags.split(',').slice(0, 5).map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="mt-4">
                  <button
                    onClick={() => handleViewDetails(act.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Details modal */}
      <AnimatePresence>
        {selectedAct && (
          <ActDetailView 
            act={selectedAct} 
            onClose={handleCloseDetails} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Acts;