import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

const Navbar = () => {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('nyaysahayak_user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('nyaysahayak_user');
        navigate('/');
    };

    return (
        <div>
        <nav className="bg-gradient-to-br from-blue-700 to-blue-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                <div className="flex-shrink-0">
                    <h1 className="text-white font-bold text-xl">NyaySahayak</h1>
                </div>
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                    <Link to="/dashboard" className="text-white hover:bg-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                        Dashboard
                    </Link>
                    <Link to="/about" className="text-gray-300 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        About
                    </Link>
                    <Link to="/upload" className="text-gray-300 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Upload Legal Doc
                    </Link>
                    <Link to="/advice" className="text-gray-300 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Get Legal Advice
                    </Link>
                    <Link to="/acts" className="text-gray-300 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Acts
                    </Link>
                    <Link to="/locate-lawyers" className="text-gray-300 hover:bg-blue-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Locate Lawyers
                    </Link>
                    </div>
                </div>
                </div>
                <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                    <span className="text-gray-300 mr-4">Welcome, {user.username || user.email}</span>
                    <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-200"
                    >
                    Logout
                    </button>
                </div>
                </div>
            </div>
            </div>
        </nav>
        </div>
    )
}

export default Navbar
