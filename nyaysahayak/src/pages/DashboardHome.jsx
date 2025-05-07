import React from 'react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {

  console.log("Dashboard is rendering");
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Welcome to NyaySahayak, User
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your personal legal assistant
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Upload Documents</h3>
          <p className="text-gray-600 mb-4">Upload legal documents for analysis and assistance</p>
          <Link to="/upload" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Upload Now
          </Link>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Get Legal Advice</h3>
          <p className="text-gray-600 mb-4">Ask questions and receive guidance on legal matters</p>
          <Link to="/advice" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Get Advice
          </Link>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Legal Acts & Statutes</h3>
          <p className="text-gray-600 mb-4">Browse and search through important legal acts</p>
          <Link to="/acts" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            View Acts
          </Link>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <h4 className="text-lg font-medium text-gray-900 mb-3">Recent Activities</h4>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 text-gray-500 text-sm">
            You haven't performed any activities yet.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;