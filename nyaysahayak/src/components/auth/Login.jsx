import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/react.svg'; 

const LoginPage = () => {

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const navigate = useNavigate();

  // Effect to check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('nyaysahayak_user'));
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Email validation
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Username validation
  const validateUsername = () => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    } else if (username.length < 4) {
      setUsernameError('Username must be at least 4 characters');
      return false;
    }
    setUsernameError('');
    return true;
  };

  // Mobile validation
  const validateMobile = () => {
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile) {
      setMobileError('Mobile number is required');
      return false;
    } else if (!mobileRegex.test(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return false;
    }
    setMobileError('');
    return true;
  };

  // Password validation
  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Confirm password validation
  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login validation
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();
      
      if (isEmailValid && isPasswordValid) {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('nyaysahayak_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Save current user to localStorage
          localStorage.setItem('nyaysahayak_user', JSON.stringify(user));
          navigate('/dashboard');
        } else {
          alert('Invalid email or password');
        }
      }
    } else {
      // Registration validation
      const isEmailValid = validateEmail();
      const isUsernameValid = validateUsername();
      const isMobileValid = validateMobile();
      const isPasswordValid = validatePassword();
      const isConfirmPasswordValid = validateConfirmPassword();
      
      if (isEmailValid && isUsernameValid && isMobileValid && isPasswordValid && isConfirmPasswordValid) {
        // Get existing users or create empty array
        const users = JSON.parse(localStorage.getItem('nyaysahayak_users') || '[]');
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
          setEmailError('This email is already registered');
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now(),
          email,
          username,
          mobile,
          password
        };
        
        // Add user to users array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('nyaysahayak_users', JSON.stringify(users));
        localStorage.setItem('nyaysahayak_user', JSON.stringify(newUser));
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    }
  };

  // Toggle between login and register forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Clear form and errors
    setEmail('');
    setUsername('');
    setMobile('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setUsernameError('');
    setMobileError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-center mb-6">
            <img className="h-16 w-auto" src={logo} alt="NyayaSathi Logo" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-1">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            {isLogin ? 'Access your legal assistant' : 'Join NyayaSathi today'}
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="you@example.com"
                />
              </div>
              {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={validateUsername}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        usernameError ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Choose a username"
                    />
                  </div>
                  {usernameError && <p className="mt-2 text-sm text-red-600">{usernameError}</p>}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      onBlur={validateMobile}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        mobileError ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  {mobileError && <p className="mt-2 text-sm text-red-600">{mobileError}</p>}
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    passwordError ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder={isLogin ? 'Enter your password' : 'Create a secure password'}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validateConfirmPassword}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      confirmPasswordError ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Confirm your password"
                  />
                </div>
                {confirmPasswordError && <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
          <p className="text-sm text-center text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleForm}
              className="ml-1 font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;