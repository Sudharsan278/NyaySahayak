import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, Languages, RotateCcw, Scale, Calendar, Tag, Building2, Shield, AlertTriangle, Gavel, BookOpen } from 'lucide-react';

const ActDetailView = ({ act, onClose }) => {
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState({});
  const [error, setError] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('hi-IN');
  const [translationSection, setTranslationSection] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  
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

  const translatableSections = {
    summary: { title: "Summary", icon: BookOpen },
    keyProvisions: { title: "Key Provisions", icon: Gavel },
    authoritiesInvolved: { title: "Authorities Involved", icon: Building2 },
    applicability: { title: "Applicability", icon: Shield },
    penalties: { title: "Penalties", icon: AlertTriangle },
    impact: { title: "Impact", icon: Scale },
    relatedLaws: { title: "Related Laws", icon: BookOpen }
  };

  const renderSection = (sectionKey, sectionData, custom) => {
    if (!act[sectionKey]) return null;

    const isTranslated = translatedContent[sectionKey];
    const isTranslating = translating && translationSection === sectionKey;
    const IconComponent = sectionData.icon;

    return (
      <motion.div 
        variants={sectionVariants}
        custom={custom}
        initial="hidden"
        animate="visible"
        className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        style={{ transitionDelay: `${custom * 100}ms` }}
      >
        <div className="group relative">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300">
                    <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-800 transition-colors duration-300">
                    {sectionData.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  {isTranslated ? (
                    <button
                      onClick={() => resetTranslation(sectionKey)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-300 hover:scale-105"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Show Original
                    </button>
                  ) : (
                    <>
                      <select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white hover:border-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
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
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                      >
                        <Languages className="w-3 h-3" />
                        {isTranslating ? 'Translating...' : 'Translate'}
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 group-hover:bg-slate-50/80 transition-colors duration-300">
                {error && translationSection === sectionKey ? (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <p>{error}</p>
                  </div>
                ) : (
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {isTranslated ? translatedContent[sectionKey] : act[sectionKey]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-6xl relative"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1 tracking-tight">
                  {act.title}
                </h2>
                <div className="flex items-center gap-4 text-slate-300 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {act.year}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {act.category}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1">
              <motion.div 
                className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                variants={sectionVariants}
                custom={0}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Category</p>
                    <p className="text-slate-800 font-medium">{act.category}</p>
                  </div>
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Year</p>
                    <p className="text-slate-800 font-medium">{act.year}</p>
                  </div>
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Enactment Date</p>
                    <p className="text-slate-800 font-medium">{act.enactmentDate || 'Not specified'}</p>
                  </div>
                  <div className="bg-slate-50/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Effective Date</p>
                    <p className="text-slate-800 font-medium">{act.effectiveDate || 'Not specified'}</p>
                  </div>
                </div>
              </motion.div>

              {act.tags && (
                <motion.div 
                  className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transform transition-all duration-700 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                  variants={sectionVariants}
                  custom={1}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Tag className="w-5 h-5 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Tags</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {act.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors duration-300"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-3 space-y-6">
              {Object.entries(translatableSections).map(([key, sectionData], index) => 
                renderSection(key, sectionData, index + 2)
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-8 py-4 bg-white flex justify-between items-center">
          <div className="inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-slate-600 font-medium">
              Secure Legal Information
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>

        <div className="absolute top-32 right-8 opacity-5 animate-float pointer-events-none">
          <Scale className="w-24 h-24 text-slate-400" />
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
        `}</style>
      </motion.div>
    </motion.div>
  );
};

export default ActDetailView;