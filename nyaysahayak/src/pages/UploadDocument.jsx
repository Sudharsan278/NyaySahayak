import React, { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker?worker';
import mammoth from 'mammoth/mammoth.browser.min';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle, Loader2, AlertCircle, Upload, Globe, Volume2, ChevronDown } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

const DocumentAnalyzer = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [translatedText, setTranslatedText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [analysisType, setAnalysisType] = useState('summarize');
  const [uploadStatus, setUploadStatus] = useState('idle'); 
  const [targetLanguage, setTargetLanguage] = useState('hi-IN');
  const [audioUrl, setAudioUrl] = useState(null);
  const [showFullText, setShowFullText] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  
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

  // Get API keys from environment variables
  const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY; 

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setUploadStatus('uploading');
    setLoading(true);
    setError(null);
    setText('');
    setResult(null);
    setTranslatedText(null);
    setAudioUrl(null);
    setShowFullText(false);
    
    const fileType = file.type;

    try {
      if (fileType === 'application/pdf') {
        await handlePdfFile(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        await handleDocxFile(file);
      } else {
        throw new Error("Unsupported File Type! Upload a PDF or DOCX file!");
      }
      setUploadStatus('success');
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error.message);
      setUploadStatus('error');
      setLoading(false);
    }
  };

  const handlePdfFile = async (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        
        try {
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let extractedText = '';
          
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            extractedText += pageText + '\n';
          }
          
          setText(extractedText);
          await handleTextContentWithGroq(extractedText);
          resolve();
        } catch (error) {
          reject(new Error('Error reading PDF: ' + error.message));
        }
      };
      
      fileReader.onerror = () => reject(new Error('Failed to read file'));
      fileReader.readAsArrayBuffer(file);
    });
  };

  const handleDocxFile = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setText(result.value);
      await handleTextContentWithGroq(result.value);
    } catch (error) {
      throw new Error("Error in reading DOCX file: " + error.message);
    }
  };

  useEffect(() => {
    if (text && !loading) {
      setLoading(true);
      handleTextContentWithGroq(text);
    }
  }, [analysisType]);

  const handleTextContentWithGroq = async (extractedText) => {
    try {
      const endpoint = analysisType === 'summarize' 
        ? 'http://localhost:8080/api/groq/summarize'
        : 'http://localhost:8080/api/groq/analyze';
        
      const payload = {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        messages: [
          {
            role: "user",
            content: extractedText
          }
        ]
      };

      const response = await axios.post(endpoint, payload);
      
      let processedContent = response.data.choices[0].message.content;
      processedContent = processedContent.replace(/^# (.*?)(?=\n|$)/gm, '$1');
      processedContent = processedContent.replace(/^## (.*?)(?=\n|$)/gm, '$1');
      processedContent = processedContent.replace(/^### (.*?)(?=\n|$)/gm, '$1');
      
      setResult(processedContent);
      setLoading(false);
    } catch (error) {
      console.error('API Error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to analyze document');
      setLoading(false);
    }
  };

  const handleTranslateClick = async () => {
    if (!result || translating) return;
    
    setTranslating(true);
    setAudioUrl(null); 

    try {
      const response = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          'input': result.slice(0, 1000),
          'source_language_code': 'en-IN',
          'target_language_code': targetLanguage
        })
      });

      const data = await response.json();
      setTranslatedText(data.translated_text || data.translate_text);
    } catch (error) {
      console.error('Translation Error:', error);
      setError('Failed to translate text: ' + error.message);
    } finally {
      setTranslating(false);
    }
  };
  
  const handleTextToSpeech = async (text, languageCode) => {
    if (!text || speaking) return;
    
    setSpeaking(true);
    
    try {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'text': text.slice(0, 1000),
          'target_language_code': languageCode || targetLanguage,
          'speaker': "anushka",
        })
      });
      
      const data = await response.json();
      
      if (data.audios && data.audios.length > 0) {
        const audioBase64 = data.audios[0];
        const audioBlob = base64ToBlob(audioBase64, 'audio/wav');
        const url = URL.createObjectURL(audioBlob);
        
        setAudioUrl(url);
        
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Text-to-Speech Error:', error);
      setError('Failed to generate speech: ' + error.message);
    } finally {
      setSpeaking(false);
    }
  };
  
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  };

  const handleAnalysisTypeChange = (type) => {
    if (type !== analysisType) {
      setAnalysisType(type);
      setTranslatedText(null); 
      setAudioUrl(null); 
    }
  };
  
  const handleLanguageChange = (e) => {
    setTargetLanguage(e.target.value);
    setTranslatedText(null); 
    setAudioUrl(null); 
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const formatContent = (content) => {
    if (!content) return null;
    
    // Replace markdown headers with HTML headers (without the #)
    let formattedContent = content.replace(/^# (.*?)(?=\n|$)/gm, '<h1 className="text-xl font-bold mb-3 mt-4">$1</h1>');
    formattedContent = formattedContent.replace(/^## (.*?)(?=\n|$)/gm, '<h2 className="text-lg font-bold mb-2 mt-3">$1</h2>');
    formattedContent = formattedContent.replace(/^### (.*?)(?=\n|$)/gm, '<h3 className="text-md font-semibold mb-2 mt-3">$1</h3>');
    
    // Replace bold text
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert bullet points to HTML list items
    formattedContent = formattedContent.replace(/^- (.*?)(?=\n|$)/gm, '<li className="ml-5 mb-1">$1</li>');
    formattedContent = formattedContent.replace(/^\* (.*?)(?=\n|$)/gm, '<li className="ml-5 mb-1">$1</li>');
    
    // Wrap consecutive list items in ul tags
    const listPattern = /(<li.*?<\/li>\n?)+/g;
    formattedContent = formattedContent.replace(listPattern, match => {
      return `<ul className="list-disc mb-4">${match}</ul>`;
    });
    
    // Convert paragraphs (segments separated by double newlines)
    const paragraphs = formattedContent.split(/\n\n+/);
    formattedContent = paragraphs.map(para => {
      // Skip wrapping if the paragraph already contains HTML tags
      if (para.includes('<h') || para.includes('<ul') || para.includes('<li') || para.trim() === '') {
        return para;
      }
      return `<p className="mb-3">${para}</p>`;
    }).join('\n\n');
    
    // Replace single newlines with <br/> tags where appropriate
    formattedContent = formattedContent.replace(/(?<!(>|\n))\n(?!(<|\n))/g, '<br/>');
    
    return (
      <div className="text-left whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formattedContent }} />
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const resultVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const translateButtonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Legal Document Analyzer</h1>
        <p className="text-gray-600">Upload your legal documents for AI-powered analysis</p>
      </motion.div>

      <motion.div 
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            uploadStatus === 'success' ? 'border-green-400 bg-green-50' :
            uploadStatus === 'error' ? 'border-red-400 bg-red-50' :
            'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onClick={triggerFileInput}
          variants={itemVariants}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.docx" 
          />
          
          {uploadStatus === 'idle' && (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Drag & drop your document here</h3>
              <p className="text-gray-500">or click to browse (PDF or DOCX)</p>
            </>
          )}
          
          {uploadStatus === 'uploading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                <h3 className="text-lg font-semibold mb-2">Processing your document...</h3>
            </motion.div>
          )}
          
          {uploadStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-lg font-semibold mb-2">{fileName}</h3>
                <p className="text-green-600 mb-2">Successfully processed</p>
                <p className="text-gray-500">Click to upload a different file</p>
            </motion.div>
          )}
          
          {uploadStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-lg font-semibold mb-2">Error processing document</h3>
                <p className="text-gray-500">Click to try again</p>
            </motion.div>
          )}
        </motion.div>
        
        {error && (
          <motion.div 
            className="mt-4 p-3 bg-red-100 text-red-700 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="font-medium">Error: {error}</p>
          </motion.div>
        )}
      </motion.div>

      {text && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-6">
            <motion.div className="flex mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <motion.button
                className={`flex-1 py-3 px-6 font-medium transition-colors duration-200 ${analysisType === 'summarize' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => handleAnalysisTypeChange('summarize')}
              >
                Summarize
              </motion.button>
              <motion.button
                className={`flex-1 py-3 px-6 font-medium transition-colors duration-200 ${analysisType === 'analyze' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => handleAnalysisTypeChange('analyze')}
              >
                Detailed Analysis
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-4 rounded-lg shadow-sm"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700">
                  Document Content
                </h3>
              </div>

              <div className="text-gray-600 text-sm overflow-hidden bg-white p-3 rounded border border-gray-200">
                {showFullText ? (
                  <div>
                    <p>{text}</p>
                    <button 
                      onClick={toggleShowFullText}
                      className="text-blue-500 hover:text-blue-700 font-medium mt-2"
                    >
                      Show less
                    </button>
                  </div>
                ) : (
                  <div>
                    <p>
                      {text.substring(0, 300)}
                      {text.length > 300 && '...'}
                    </p>
                    {text.length > 300 && (
                      <button 
                        onClick={toggleShowFullText}
                        className="text-blue-500 hover:text-blue-700 font-medium mt-2"
                      >
                        See more
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {loading ? (
          <motion.div 
            className="text-center p-8 bg-blue-50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <h3 className="text-xl font-semibold mb-2">Analyzing your document</h3>
            <p className="text-gray-600">Our AI is processing your document...</p>
          </motion.div>
        ) : result ? (
          <motion.div 
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            variants={resultVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-bold">
                {analysisType === 'summarize' ? 'Document Summary' : 'Detailed Analysis'}
              </h2>
            </div>
            
            <div className="bg-gray-100 p-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <select 
                  value={targetLanguage}
                  onChange={handleLanguageChange}
                  className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <motion.button
                onClick={handleTranslateClick}
                disabled={translating}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
                  translating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                variants={translateButtonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                {translating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Translating...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Translate</span>
                  </>
                )}
              </motion.button>
            </div>

            <div className="p-6 bg-white">
              {formatContent(result)}
            </div>
            
            <AnimatePresence>
              {translatedText && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="bg-gray-100 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-500" />
                      <h3 className="font-medium text-gray-800">
                        {languages.find(lang => lang.code === targetLanguage)?.name || "Translated"} Translation
                      </h3>
                    </div>
                    
                    <motion.button
                      onClick={() => handleTextToSpeech(translatedText, targetLanguage)}
                      disabled={speaking}
                      className={`flex items-center gap-2 px-3 py-1 rounded-md text-white ${
                        speaking ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'
                      }`}
                      variants={translateButtonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {speaking ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Listen</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="p-6 bg-white">
                    {formatContent(translatedText)}
                  </div>

                  {audioUrl && (
                    <div className="px-6 pb-6">
                      <audio ref={audioRef} controls className="w-full" src={audioUrl} />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default DocumentAnalyzer;