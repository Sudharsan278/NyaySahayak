import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const ActDetailView = ({ act, onClose }) => {
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState({});
  const [error, setError] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('hi-IN');
  const [translationSection, setTranslationSection] = useState(null);
  
  const languages = [
    { code: 'bn-IN', name: 'Bengali' },
    { code: 'gu-IN', name: 'Gujarati' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'kn-IN', name: 'Kannada' },
    { code: 'ml-IN', name: 'Malayalam' },
    { code: 'mr-IN', name: 'Marathi' },
    { code: 'od-IN', name: 'Oriya' },
    { code: 'pa-IN', name: 'Punjabi' },
    { code: 'ta-IN', name: 'Tamil' }
  ];

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

  const handleTranslateClick = async (sectionKey) => {
    if (!act[sectionKey] || translating) return;
    
    setTranslating(true);
    setTranslationSection(sectionKey);
    setError(null);

    try {
      
      const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY;
      
      const textToTranslate = act[sectionKey].slice(0, 1000);
      
      const response = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          'input': textToTranslate,
          'source_language_code': 'en-IN',
          'target_language_code': targetLanguage
        })
      });

      const data = await response.json();
      
      setTranslatedContent({
        ...translatedContent,
        [sectionKey]: data.translated_text || data.translate_text
      });
    } catch (error) {
      console.error('Translation Error:', error);
      setError('Failed to translate text: ' + error.message);
    } finally {
      setTranslating(false);
    }
  };

  const resetTranslation = (sectionKey) => {
    const updatedTranslatedContent = {...translatedContent};
    delete updatedTranslatedContent[sectionKey];
    setTranslatedContent(updatedTranslatedContent);
  };

  // Define which sections are translatable
  const translatableSections = {
    summary: "Summary",
    keyProvisions: "Key Provisions",
    authoritiesInvolved: "Authorities Involved",
    applicability: "Applicability",
    penalties: "Penalties",
    impact: "Impact",
    relatedLaws: "Related Laws"
  };

  const renderSection = (sectionKey, title, custom) => {
    if (!act[sectionKey]) return null;

    const isTranslated = translatedContent[sectionKey];
    const isTranslating = translating && translationSection === sectionKey;

    return (
      <motion.div 
        variants={sectionVariants}
        custom={custom}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex items-center space-x-2">
            {isTranslated ? (
              <button
                onClick={() => resetTranslation(sectionKey)}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                Show Original
              </button>
            ) : (
              <>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="text-xs border border-gray-300 rounded px-1 py-1"
                  disabled={isTranslating}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleTranslateClick(sectionKey)}
                  disabled={isTranslating}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50"
                >
                  {isTranslating ? 'Translating...' : 'Translate'}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          {error && translationSection === sectionKey ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <p className="text-gray-700">
              {isTranslated ? translatedContent[sectionKey] : act[sectionKey]}
            </p>
          )}
        </div>
      </motion.div>
    );
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

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="md:col-span-2 space-y-6">
              {Object.entries(translatableSections).map(([key, title], index) => 
                renderSection(key, title, index + 2)
              )}
            </div>
          </div>
        </div>

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