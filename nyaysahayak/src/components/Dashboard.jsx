import React from 'react';
import DashboardHome from '../pages/DashboardHome';

const Dashboard = () => {
 
  const user = JSON.stringify(localStorage.getItem('nyaysahayak_user'));
  return (
    <div className="min-h-screen bg-gray-100">   

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900">Welcome to your Dashboard</h2>
        <div className='border border-red-500'>
          <DashboardHome user = {user}/>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
