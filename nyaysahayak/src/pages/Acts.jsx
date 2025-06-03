import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkPlus, BookmarkMinus, Trash2, Eye, User } from 'lucide-react';
import ActDetailView from '../components/ActDetailView.jsx'; 

const Acts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActId, setSelectedActId] = useState(null);
  const [savedActs, setSavedActs] = useState([]);
  const [savedActIds, setSavedActIds] = useState(new Set());
  const [savingStates, setSavingStates] = useState(new Map());
  const [activeTab, setActiveTab] = useState('all-acts'); // 'all-acts' or 'saved-acts'
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from your auth system/context
  useEffect(() => {
    
    const getUserFromAuth = () => {
    
      const userEmail = JSON.parse(localStorage.getItem('Logged in user')).email;
      const userFirstName = JSON.parse(localStorage.getItem('Logged in user')).name;
      
      if (userEmail && userFirstName) {
        setCurrentUser({
          email: userEmail,
          firstName: userFirstName
        });
      }
    };

    getUserFromAuth();
  }, []);

  console.log(currentUser);
  console.log(currentUser);

  useEffect(() => {
    fetchActs();
  }, []);

  useEffect(() => {
    if (currentUser?.email) {
      fetchSavedActs();
    }
  }, [currentUser]);

  const fetchActs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/acts');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch acts: ${response.status} ${response.statusText}`);
      }
      
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

  const fetchSavedActs = async () => {
    if (!currentUser?.email) return;

    try {
      const response = await fetch(`http://localhost:8080/api/saved-acts/user/${encodeURIComponent(currentUser.email)}`);
      if (response.ok) {
        const savedActsData = await response.json();
        setSavedActs(savedActsData);
        const savedActIds = new Set(savedActsData.map(savedAct => savedAct.actId));
        setSavedActIds(savedActIds);
      }
    } catch (error) {
      console.error('Error fetching saved acts:', error);
    }
  };

  const handleSaveAct = async (actId) => {
    if (!currentUser?.email) {
      alert('Please log in to save acts');
      return;
    }

    setSavingStates(prev => new Map(prev).set(actId, 'saving'));

    try {
      const response = await fetch('http://localhost:8080/api/saved-acts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: currentUser.email,
          userFirstName: currentUser.firstName,
          actId: actId
        })
      });

      if (response.ok) {
        setSavedActIds(prev => new Set(prev).add(actId));
        setSavingStates(prev => new Map(prev).set(actId, 'saved'));
        
        // Refresh saved acts list
        await fetchSavedActs();
        
        setTimeout(() => {
          setSavingStates(prev => {
            const newMap = new Map(prev);
            newMap.delete(actId);
            return newMap;
          });
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save act');
      }
    } catch (error) {
      console.error('Error saving act:', error);
      setSavingStates(prev => new Map(prev).set(actId, 'error'));
      alert(error.message || 'Failed to save act. Please try again.');
      
      setTimeout(() => {
        setSavingStates(prev => {
          const newMap = new Map(prev);
          newMap.delete(actId);
          return newMap;
        });
      }, 3000);
    }
  };

  const handleUnsaveAct = async (actId) => {
    if (!currentUser?.email) return;

    setSavingStates(prev => new Map(prev).set(actId, 'removing'));

    try {
      const response = await fetch(
        `http://localhost:8080/api/saved-acts/user/${encodeURIComponent(currentUser.email)}/act/${actId}`,
        {
          method: 'DELETE'
        }
      );

      if (response.ok) {
        setSavedActIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(actId);
          return newSet;
        });
        setSavedActs(prev => prev.filter(savedAct => savedAct.actId !== actId));
        setSavingStates(prev => new Map(prev).set(actId, 'removed'));
        
        setTimeout(() => {
          setSavingStates(prev => {
            const newMap = new Map(prev);
            newMap.delete(actId);
            return newMap;
          });
        }, 1500);
      } else {
        throw new Error('Failed to remove saved act');
      }
    } catch (error) {
      console.error('Error removing saved act:', error);
      setSavingStates(prev => new Map(prev).set(actId, 'error'));
      alert('Failed to remove saved act. Please try again.');
      
      setTimeout(() => {
        setSavingStates(prev => {
          const newMap = new Map(prev);
          newMap.delete(actId);
          return newMap;
        });
      }, 3000);
    }
  };

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

  const handleCloseDetails = () => {
    setSelectedActId(null);
  };

  const selectedAct = acts.find(act => act.id === selectedActId) || 
                     savedActs.find(savedAct => savedAct.actId === selectedActId);

  // Animation variants
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

  const getSaveButtonContent = (actId) => {
    const savingState = savingStates.get(actId);
    const isSaved = savedActIds.has(actId);

    if (savingState === 'saving') {
      return {
        icon: <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />,
        text: 'Saving...',
        disabled: true,
        className: 'bg-indigo-400'
      };
    }

    if (savingState === 'removing') {
      return {
        icon: <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />,
        text: 'Removing...',
        disabled: true,
        className: 'bg-red-400'
      };
    }

    if (savingState === 'saved') {
      return {
        icon: <BookmarkPlus className="w-4 h-4" />,
        text: 'Saved!',
        disabled: true,
        className: 'bg-green-500'
      };
    }

    if (savingState === 'removed') {
      return {
        icon: <BookmarkMinus className="w-4 h-4" />,
        text: 'Removed!',
        disabled: true,
        className: 'bg-gray-500'
      };
    }

    if (savingState === 'error') {
      return {
        icon: <BookmarkPlus className="w-4 h-4" />,
        text: 'Error - Retry',
        disabled: false,
        className: 'bg-red-500 hover:bg-red-600'
      };
    }

    if (isSaved) {
      return {
        icon: <BookmarkMinus className="w-4 h-4" />,
        text: 'Remove',
        disabled: false,
        className: 'bg-red-500 hover:bg-red-600'
      };
    }

    return {
      icon: <BookmarkPlus className="w-4 h-4" />,
      text: 'Save',
      disabled: false,
      className: 'bg-green-500 hover:bg-green-600'
    };
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-indigo-800 text-2xl font-bold">Legal Acts & Statutes</h1>
            <p className="text-indigo-600">Browse and search through important legal acts and statutes of India</p>
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-indigo-800 text-2xl font-bold">Legal Acts & Statutes</h1>
            <p className="text-indigo-600">Browse and search through important legal acts and statutes of India</p>
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-indigo-800 text-2xl font-bold">Legal Acts & Statutes</h1>
              <p className="text-indigo-600">Browse and search through important legal acts and statutes of India</p>
            </div>
            {currentUser && (
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <User className="w-4 h-4 mr-1" />
                  {currentUser.firstName}
                </div>
                <p className="text-xs text-gray-500">Saved Acts: {savedActs.length}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('all-acts')}
              className={`px-6 py-3 font-medium text-sm rounded-tl-lg transition-colors ${
                activeTab === 'all-acts'
                  ? 'bg-indigo-600 text-white border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Acts ({acts.length})
            </button>
            <button
              onClick={() => setActiveTab('saved-acts')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === 'saved-acts'
                  ? 'bg-indigo-600 text-white border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Saved Acts ({savedActs.length})
            </button>
          </div>
        </div>

        {activeTab === 'all-acts' ? (
          <>
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
              {filteredActs.map((act) => {
                const saveButtonProps = getSaveButtonContent(act.id);
                
                return (
                  <motion.div 
                    key={act.id}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-indigo-600">{act.title}</h2>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                            {act.category}
                          </span>
                          {savedActIds.has(act.id) && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Saved
                            </span>
                          )}
                        </div>
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
                      
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleViewDetails(act.id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        
                        {currentUser && (
                          <button
                            onClick={() => savedActIds.has(act.id) ? handleUnsaveAct(act.id) : handleSaveAct(act.id)}
                            disabled={saveButtonProps.disabled}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${saveButtonProps.className}`}
                          >
                            {saveButtonProps.icon}
                            <span className="ml-2">{saveButtonProps.text}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        ) : (
          <>
            {/* Saved Acts Section */}
            <div className="text-white text-lg font-medium mb-4">
              Your Saved Acts ({savedActs.length})
            </div>
            
            {!currentUser ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Please Log In</h3>
                <p className="text-gray-600">You need to be logged in to view your saved acts.</p>
              </div>
            ) : savedActs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <BookmarkPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Acts</h3>
                <p className="text-gray-600">You haven't saved any acts yet. Browse the acts and click "Save" to add them here.</p>
                <button 
                  onClick={() => setActiveTab('all-acts')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Browse Acts
                </button>
              </div>
            ) : (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {savedActs.map((savedAct) => (
                  <motion.div 
                    key={savedAct.id}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h2 className="text-lg font-medium text-indigo-600">{savedAct.title}</h2>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Saved on: {new Date(savedAct.savedAt).toLocaleDateString()}
                          </div>
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                            {savedAct.summary ? (savedAct.summary.length > 150 ? savedAct.summary.substring(0, 150) + '...' : savedAct.summary) : ''}
                          </p>
                        </div>
                        <span className="ml-4 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Saved
                        </span>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleViewDetails(savedAct.actId)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        
                        <button
                          onClick={() => handleUnsaveAct(savedAct.actId)}
                          disabled={savingStates.get(savedAct.actId) === 'removing'}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
                        >
                          {savingStates.get(savedAct.actId) === 'removing' ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <BookmarkMinus className="w-4 h-4 mr-2" />
                          )}
                          {savingStates.get(savedAct.actId) === 'removing' ? 'Removing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
      
      {/* ActDetailView component */}
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