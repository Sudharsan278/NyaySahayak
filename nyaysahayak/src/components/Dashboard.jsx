import React from 'react';
import DashboardHome from '../pages/DashboardHome';

const Dashboard = () => {
 
  return (
    <div className="min-h-screen bg-gray-50">   
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome to the Dashboard!</h2>
        </div>
        <div>
          <DashboardHome />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;