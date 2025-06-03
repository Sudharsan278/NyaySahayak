import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Menu, X, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('Logged in user'));
    const dropdownRef = useRef(null);

    const getUserInitials = () => {
        if (user.username) {
            return user.username.substring(0, 1).toUpperCase();
        } else if (user.email) {
            return user.email.substring(0, 1).toUpperCase();
        }
        return 'U';
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('nyaysahayak_user');
        navigate('/');
    };

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/upload', label: 'Upload Documents' },
        { to: '/advice', label: 'Legal Advice' },
        { to: '/acts', label: 'Acts & Statutes' },
        { to: '/locate-lawyers', label: 'Find Lawyers' },
        { to: '/about', label: 'About' }
    ];

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="bg-slate-900 p-2 rounded-lg mr-3">
                                <Scale className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-slate-900 font-semibold text-xl tracking-tight">
                                NyaySahayak
                            </h1>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                            >
                                <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-medium text-sm">
                                    {getUserInitials()}
                                </div>
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-medium">
                                                {getUserInitials()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {user.username && (
                                                    <p className="text-sm font-medium text-slate-900 truncate">
                                                        {user.username}
                                                    </p>
                                                )}
                                                <p className="text-sm text-slate-500 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                        
                        <div className="border-t border-gray-200 pt-4 pb-3">
                            <div className="flex items-center px-3 mb-3">
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-medium mr-3">
                                    {getUserInitials()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    {user.username && (
                                        <div className="text-sm font-medium text-slate-900 truncate">
                                            {user.username}
                                        </div>
                                    )}
                                    <div className="text-sm text-slate-500 truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-base font-medium transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;