import React from 'react';
import { FaBalanceScale, FaFileAlt, FaUsers, FaEnvelope, FaPhone } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white text-center py-12">
        <h1 className="text-3xl font-bold">About NyayaSathi</h1>
        <p className="mt-2 text-lg">Your personal legal assistant</p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid gap-6">
          
          {/* About Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <p className="text-gray-700 text-lg">
              NyayaSathi is a comprehensive legal assistance platform designed to help individuals 
              navigate the complexities of the legal system. Our mission is to make legal 
              information accessible, understandable, and actionable for everyone.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex items-center">
            <FaBalanceScale className="text-blue-600 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-semibold">Our Mission</h3>
              <p className="text-gray-700">
                To democratize access to legal information and assistance, empowering individuals 
                to understand their rights and take informed legal actions.
              </p>
            </div>
          </div>

          {/* Offerings Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold flex items-center">
              <FaFileAlt className="text-blue-600 text-2xl mr-2" /> What We Offer
            </h3>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li>✔️ Document analysis and interpretation</li>
              <li>✔️ Personalized legal advice and guidance</li>
              <li>✔️ Access to legal acts, statutes, and precedents</li>
              <li>✔️ Simplified explanations of complex legal concepts</li>
            </ul>
          </div>

          {/* Team Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex items-center">
            <FaUsers className="text-blue-600 text-3xl mr-4" />
            <div>
              <h3 className="text-xl font-semibold">Our Team</h3>
              <p className="text-gray-700">
                NyayaSathi is developed by a team of legal experts, technologists, and accessibility 
                advocates committed to bridging the gap between legal professionals and the public.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold flex items-center">
              <FaEnvelope className="text-blue-600 text-2xl mr-2" /> Contact Us
            </h3>
            <p className="text-gray-700 mt-2">
              If you have any questions or feedback about NyayaSathi, please contact us at:
            </p>
            <p className="mt-3 text-gray-800 flex items-center">
              <FaEnvelope className="text-blue-600 mr-2" /> support@nyayasathi.com
            </p>
            <p className="text-gray-800 flex items-center mt-1">
              <FaPhone className="text-blue-600 mr-2" /> +91-123-456-7890
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
