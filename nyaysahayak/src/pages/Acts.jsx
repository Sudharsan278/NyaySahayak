import React, { useState } from 'react';

const Acts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  
  // Sample data for acts
  const actsData = [
    { id: 1, title: "The Constitution of India", category: "constitutional", year: 1950, description: "The supreme law of India that lays down the framework defining fundamental political principles." },
    { id: 2, title: "Indian Penal Code", category: "criminal", year: 1860, description: "The main criminal code of India, covering all substantive aspects of criminal law." },
    { id: 3, title: "Code of Criminal Procedure", category: "criminal", year: 1973, description: "The main legislation on procedure for administration of criminal law in India." },
    { id: 4, title: "The Indian Contract Act", category: "civil", year: 1872, description: "Codifies the way in which contracts are entered into, executed and implemented in India." },
    { id: 5, title: "Consumer Protection Act", category: "consumer", year: 2019, description: "Protects the interests of consumers and establishes authorities for timely and effective settlement of consumer disputes." },
    { id: 6, title: "The Companies Act", category: "corporate", year: 2013, description: "Regulates incorporation of a company, responsibilities of a company, directors, and dissolution of a company." }
  ];
  
  // Filter acts based on search term and category
  const filteredActs = actsData.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          act.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || act.category === category;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Legal Acts & Statutes
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Browse and search through important legal acts and statutes
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search Acts</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by title or keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
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
                <option value="corporate">Corporate</option>
                <option value="consumer">Consumer</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {filteredActs.length > 0 ? `Found ${filteredActs.length} acts` : 'No acts found'}
            </h4>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredActs.map((act) => (
                  <li key={act.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {act.title}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {act.category.charAt(0).toUpperCase() + act.category.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Year: {act.year}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {act.description}
                      </p>
                      <div className="mt-3">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acts;