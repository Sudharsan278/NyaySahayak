import React from 'react';
import { motion } from 'framer-motion';

const ActDetailView = ({ act, onClose }) => {
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -50, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      } 
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-4xl"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{act.title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-indigo-200 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Basic info */}
            <div className="md:col-span-1">
              <motion.div 
                className="bg-indigo-50 p-4 rounded-lg mb-4"
                variants={sectionVariants}
                custom={0}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-lg font-medium text-indigo-800 mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-indigo-700">{act.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Year</p>
                    <p>{act.year}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Enactment Date</p>
                    <p>{act.enactmentDate || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Effective Date</p>
                    <p>{act.effectiveDate || 'Not specified'}</p>
                  </div>
                </div>
              </motion.div>

              {act.tags && (
                <motion.div 
                  className="bg-indigo-50 p-4 rounded-lg"
                  variants={sectionVariants}
                  custom={1}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {act.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right column - Detailed info */}
            <div className="md:col-span-2 space-y-6">
              {act.summary && (
                <motion.div 
                  variants={sectionVariants}
                  custom={2}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{act.summary}</p>
                  </div>
                </motion.div>
              )}

              {act.keyProvisions && (
                <motion.div 
                  variants={sectionVariants}
                  custom={3}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Key Provisions</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{act.keyProvisions}</p>
                  </div>
                </motion.div>
              )}

              {act.authoritiesInvolved && (
                <motion.div 
                  variants={sectionVariants}
                  custom={4}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Authorities Involved</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{act.authoritiesInvolved}</p>
                  </div>
                </motion.div>
              )}

              {act.applicability && (
                <motion.div 
                  variants={sectionVariants}
                  custom={5}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Applicability</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{act.applicability}</p>
                  </div>
                </motion.div>
              )}

              {act.penalties && (
                <motion.div 
                  variants={sectionVariants}
                  custom={6}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Penalties</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{act.penalties}</p>
                  </div>
                </motion.div>
              )}

              {act.impact && (
                <motion.div 
                  variants={sectionVariants}
                  custom={7}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Impact</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{act.impact}</p>
                  </div>
                </motion.div>
              )}

              {act.relatedLaws && (
                <motion.div 
                  variants={sectionVariants}
                  custom={8}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Related Laws</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700">{act.relatedLaws}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActDetailView;