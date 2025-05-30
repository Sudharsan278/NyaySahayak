import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Star, MapPin, Phone, Mail, Calendar, X, Users, Award, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LawyerMapInterface = () => {
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const center = [20.5937, 78.9629];
  const zoom = 6;

  const geocodeLocation = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', India')}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const createMarkerIcon = (lawyer) => {
    const firstName = getFirstName(lawyer.name);
    const initial = firstName.charAt(0).toUpperCase();
    
    const svgIcon = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
        <text x="20" y="26" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${initial}</text>
      </svg>
    `;
    
    return L.divIcon({
      html: svgIcon,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  };

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      
      
      const response = await fetch('http://localhost:8080/api/lawyers');
        
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const lawyersData = await response.json();
      
      const lawyersWithCoordinates = await Promise.all(
        lawyersData.map(async (lawyer) => {
          console.log(lawyer)
          const coordinates = await geocodeLocation(lawyer.location);
          return {
            ...lawyer,
            coordinates: coordinates || { lat: 0, lng: 0 }
          };
        })
      );
      
      setLawyers(lawyersWithCoordinates);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching lawyers:', err);
      
      setSampleData();
    } finally {
      setLoading(false);
    }
  };

  const setSampleData = async () => {
        
    const lawyersWithCoordinates = await Promise.all(
      sampleLawyers.map(async (lawyer) => {
        const coordinates = await geocodeLocation(lawyer.location);
        return {
          ...lawyer,
          coordinates: coordinates || { lat: 0, lng: 0 }
        };
      })
    );
    
    setLawyers(lawyersWithCoordinates);
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

  const handleBookMeeting = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowBookingModal(true);
  };

  const getFirstName = (fullName) => {
    return fullName.split(' ')[1] || fullName.split(' ')[0];
  };

  const PopupContent = ({ lawyer }) => (
    <div className="p-2 min-w-[250px]">
      <div className="flex items-center mb-3">
        <img
          src={lawyer.profilePic || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face'}
          alt={lawyer.name}
          className="w-12 h-12 rounded-full object-cover mr-3"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face';
          }}
        />
        <div>
          <h3 className="text-lg font-bold text-gray-900">{lawyer.name}</h3>
          <p className="text-blue-600 font-medium text-sm">{lawyer.specialization}</p>
        </div>
      </div>
      
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={`${
              i < Math.floor(lawyer.rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({lawyer.rating})</span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin size={14} className="mr-2" />
          <span className="text-sm">{lawyer.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone size={14} className="mr-2" />
          <span className="text-sm">{lawyer.phone}</span>
        </div>
      </div>

      <button
        onClick={() => handleBookMeeting(lawyer)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center text-sm"
      >
        <Calendar size={14} className="mr-2" />
        Book Meeting
      </button>
    </div>
  );

  const BookingModal = ({ lawyer }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Book a Meeting</h2>
            <p className="text-blue-100">with {lawyer.name}</p>
          </div>
          <button
            onClick={() => setShowBookingModal(false)}
            className="text-white hover:text-blue-200 transition duration-200"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-slate-800 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <img
                src={lawyer.profilePic || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=48&h=48&fit=crop&crop=face'}
                alt={lawyer.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=48&h=48&fit=crop&crop=face';
                }}
              />
              <div>
                <h3 className="font-semibold text-white">{lawyer.name}</h3>
                <p className="text-white text-sm">{lawyer.specialization}</p>
                <p className="text-white text-sm">{lawyer.location}</p>
              </div>
            </div>
          </div>
          
          <div className="h-96 md:h-[500px]">
            <iframe
              src={`${lawyer.calUrl}?embed=true`}
              width="100%"
              height="100%"
              frameBorder="0"
              title={`Book meeting with ${lawyer.name}`}
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Header */}
      <nav className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center mr-3">
                  <span className="text-white text-xl font-bold drop-shadow-sm">न्</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">NyaySahayak</h1>
              </motion.div>
            </div>
            <div className="flex items-center">
              <p className="text-gray-600 mr-4">Find Lawyers Near You</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Legal Experts</h2>
            <p className="text-gray-600">Connect with qualified lawyers in your area and book consultations easily.</p>
          </motion.div>

          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-96 md:h-[600px] rounded-xl shadow-xl overflow-hidden"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-[1000]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading lawyers...</p>
                </div>
              </div>
            )}

            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {lawyers.map((lawyer) => 
                lawyer.coordinates && lawyer.coordinates.lat !== 0 && (
                  <Marker
                    key={lawyer.id}
                    position={[lawyer.coordinates.lat, lawyer.coordinates.lng]}
                    icon={createMarkerIcon(lawyer)}
                  >
                    <Popup>
                      <PopupContent lawyer={lawyer} />
                    </Popup>
                  </Marker>
                )
              )}
            </MapContainer>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">{lawyers.length}</div>
              <div className="text-gray-600">Available Lawyers</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {lawyers.length > 0 ? (lawyers.reduce((sum, lawyer) => sum + lawyer.rating, 0) / lawyers.length).toFixed(1) : '0'}
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedLawyer && (
          <BookingModal lawyer={selectedLawyer} />
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default LawyerMapInterface;