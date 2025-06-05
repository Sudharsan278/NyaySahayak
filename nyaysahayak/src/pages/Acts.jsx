import React, { useState, useEffect } from 'react';
import { BookmarkPlus, BookmarkMinus, Eye, User, Search, Filter, Calendar, Tag, CheckCircle, AlertCircle } from 'lucide-react';
import ActDetailView from '../components/ActDetailView.jsx'; 
import { motion, AnimatePresence } from 'framer-motion';


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
  const [activeTab, setActiveTab] = useState('all-acts');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUserFromAuth = () => {
      try {
        const userEmail = JSON.parse(localStorage.getItem('Logged in user')).email;
        const userFirstName = JSON.parse(localStorage.getItem('Logged in user')).name;
        
        if (userEmail && userFirstName) {
          setCurrentUser({
            email: userEmail,
            firstName: userFirstName
          });
        }
      } catch (error) {
        console.error('Error getting user from localStorage:', error);
      }
    };

    getUserFromAuth();
  }, []);

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

  const filteredActs = acts.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (act.summary && act.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (act.keyProvisions && act.keyProvisions.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = category === 'all' || 
                          (act.category && act.category.toLowerCase() === category.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (actId) => {
    setSelectedActId(actId);
  };

  const handleCloseDetails = () => {
    setSelectedActId(null);
  };

  const selectedAct = acts.find(act => act.id === selectedActId) || 
                     savedActs.find(savedAct => savedAct.actId === selectedActId);

  const getSaveButtonContent = (actId) => {
    const savingState = savingStates.get(actId);
    const isSaved = savedActIds.has(actId);

    if (savingState === 'saving') {
      return {
        icon: <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />,
        text: 'Saving...',
        disabled: true,
        className: 'bg-slate-400 cursor-not-allowed'
      };
    }

    if (savingState === 'removing') {
      return {
        icon: <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />,
        text: 'Removing...',
        disabled: true,
        className: 'bg-red-400 cursor-not-allowed'
      };
    }

    if (savingState === 'saved') {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Saved!',
        disabled: true,
        className: 'bg-green-500 cursor-not-allowed'
      };
    }

    if (savingState === 'removed') {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Removed!',
        disabled: true,
        className: 'bg-gray-500 cursor-not-allowed'
      };
    }

    if (savingState === 'error') {
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'Error - Retry',
        disabled: false,
        className: 'bg-red-500 hover:bg-red-600 transition-colors'
      };
    }

    if (isSaved) {
      return {
        icon: <BookmarkMinus className="w-4 h-4" />,
        text: 'Remove',
        disabled: false,
        className: 'bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors'
      };
    }

    return {
      icon: <BookmarkPlus className="w-4 h-4" />,
      text: 'Save',
      disabled: false,
      className: 'bg-green-500 hover:bg-green-600 active:bg-green-700 transition-colors'
    };
  };

  const categoryColors = {
    constitutional: 'bg-purple-100 text-purple-800 border-purple-200',
    criminal: 'bg-red-100 text-red-800 border-red-200',
    civil: 'bg-slate-100 text-slate-800 border-slate-200',
    governance: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-b border-slate-200 shadow-sm rounded-xl p-6 mb-6">
            <h1 className="text-slate-800 text-3xl font-bold mb-2">Legal Acts & Statutes</h1>
            <p className="text-slate-600">Browse and search through important legal acts and statutes of India</p>
          </div>
          
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 rounded-full absolute border-4 border-solid border-slate-300"></div>
              <div className="w-16 h-16 rounded-full animate-spin absolute border-4 border-solid border-slate-600 border-t-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border-b border-slate-200 shadow-sm rounded-xl p-6 mb-6">
            <h1 className="text-slate-800 text-3xl font-bold mb-2">Legal Acts & Statutes</h1>
            <p className="text-slate-600">Browse and search through important legal acts and statutes of India</p>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Acts</h3>
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={fetchActs}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Legal Acts & Statutes</h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Comprehensive database of India's legal acts and statutes. Search, explore, and save important legal documents for reference.
              </p>
            </div>
            {currentUser && (
              <div className="text-right bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center text-sm text-slate-700 mb-1">
                  <User className="w-4 h-4 mr-2 text-slate-500" />
                  <span className="font-medium">{currentUser.firstName}</span>
                </div>
                <p className="text-xs text-slate-500">
                  <span className="font-medium">{savedActs.length}</span> saved acts
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab('all-acts')}
              className={`flex-1 px-6 py-4 text-sm font-medium rounded-l-xl transition-all duration-200 ${
                activeTab === 'all-acts'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>All Acts</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  activeTab === 'all-acts' 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {acts.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('saved-acts')}
              className={`flex-1 px-6 py-4 text-sm font-medium rounded-r-xl transition-all duration-200 ${
                activeTab === 'saved-acts'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Saved Acts</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  activeTab === 'saved-acts' 
                    ? 'bg-slate-600 text-white' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {savedActs.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'all-acts' ? (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-3">
                    Search Legal Acts
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="search"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                      placeholder="Search by title, summary, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-3">
                    Filter by Category
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Filter className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      id="category"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors appearance-none bg-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="constitutional">Constitutional Law</option>
                      <option value="criminal">Criminal Law</option>
                      <option value="civil">Civil Law</option>
                      <option value="governance">Governance & Administration</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="text-slate-700">
                <span className="text-sm">Showing </span>
                <span className="font-semibold text-lg text-slate-800">{filteredActs.length}</span>
                <span className="text-sm"> of {acts.length} legal acts</span>
              </div>
              {searchTerm && (
                <div className="text-sm text-slate-500">
                  Search results for: <span className="font-medium">"{searchTerm}"</span>
                </div>
              )}
            </div>
            
            <div className="grid gap-6">
              {filteredActs.map((act) => {
                const saveButtonProps = getSaveButtonContent(act.id);
                const isSaved = savedActIds.has(act.id);
                
                return (
                  <div 
                    key={act.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-900 line-clamp-1">
                              {act.title}
                            </h3>
                            {isSaved && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Saved
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>Year: {act.year}</span>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColors[act.category] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                              {act.category ? act.category.charAt(0).toUpperCase() + act.category.slice(1) : 'General'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {act.summary ? (act.summary.length > 150 ? act.summary.substring(0, 150) + '...' : act.summary) : 'No summary available'}
                      </p>
                      
                      {act.tags && (
                        <div className="flex items-start mb-4">
                          <Tag className="w-4 h-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div className="flex flex-wrap gap-2">
                            {act.tags.split(',').slice(0, 5).map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleViewDetails(act.id)}
                          className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        
                        {currentUser && (
                          <button
                            onClick={() => isSaved ? handleUnsaveAct(act.id) : handleSaveAct(act.id)}
                            disabled={saveButtonProps.disabled}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${saveButtonProps.className}`}
                          >
                            {saveButtonProps.icon}
                            <span className="ml-2">{saveButtonProps.text}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-slate-700">
                <span className="text-sm">Your saved legal acts </span>
                <span className="font-semibold text-lg text-slate-800">({savedActs.length})</span>
              </div>
            </div>
            
            {!currentUser ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Please Log In</h3>
                <p className="text-slate-600 mb-6">You need to be logged in to view your saved acts.</p>
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors">
                  Sign In
                </button>
              </div>
            ) : savedActs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <BookmarkPlus className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Saved Acts Yet</h3>
                <p className="text-slate-600 mb-6">Start building your legal library by saving acts that are important to you.</p>
                <button 
                  onClick={() => setActiveTab('all-acts')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                >
                  Browse Legal Acts
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {savedActs.map((savedAct) => (
                  <div 
                    key={savedAct.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-900">
                              {savedAct.title}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Saved
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-slate-500 mb-3">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Saved on: {new Date(savedAct.savedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {savedAct.summary ? (savedAct.summary.length > 150 ? savedAct.summary.substring(0, 150) + '...' : savedAct.summary) : 'No summary available'}
                      </p>
                      
                      <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleViewDetails(savedAct.actId)}
                          className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        
                        <button
                          onClick={() => handleUnsaveAct(savedAct.actId)}
                          disabled={savingStates.get(savedAct.actId) === 'removing'}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition-all duration-200"
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
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
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