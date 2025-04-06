"use client";
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  alpha,
  useTheme,
  InputAdornment,
  Collapse,
  Alert,
  Button,
  Tooltip,
  Tabs,
  Tab,
  Badge,
  CircularProgress,
  Snackbar,
  Slide,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  SwapHoriz,
  Mic,
  VolumeUp,
  ContentCopy,
  Check,
  Translate,
  AutoFixHigh,
  LightMode,
  DarkMode,
  Info,
  History,
  Favorite,
  FavoriteBorder,
  Delete,
  Language,
  KeyboardVoice,
  Stop,
  Flag,
  AutoAwesome,
  Help,
  SmartToy,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced Styled Components
const MainContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 32,
  backdropFilter: 'blur(20px)',
  background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha('#f5f7ff', 0.95)} 100%)`,
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
  },
}));

const TranslationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha('#f5f7ff', 0.95)} 100%)`,
  backdropFilter: 'blur(12px)',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 25px 45px rgba(0, 0, 0, 0.15)',
  },
}));

const SwapButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha('#3f51b5', 0.9)} 0%, ${alpha('#2196f3', 0.9)} 100%)`,
  color: 'white',
  width: 64,
  height: 64,
  borderRadius: '50%',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.1) rotate(180deg)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
  },
}));

const HistoryItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha('#f5f7ff', 0.95)} 100%)`,
  backdropFilter: 'blur(12px)',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateX(8px)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
  },
}));

const SuggestionChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  borderRadius: 20,
  background: `linear-gradient(135deg, ${alpha('#e3f2fd', 0.8)} 0%, ${alpha('#bbdefb', 0.8)} 100%)`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    background: `linear-gradient(135deg, ${alpha('#bbdefb', 0.9)} 0%, ${alpha('#90caf9', 0.9)} 100%)`,
  },
}));

// Enhanced languages list with flags
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
];

export default function TranslatorPage() {
  const theme = useTheme();
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('hi');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAIHelp, setShowAIHelp] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionError, setRecognitionError] = useState(null);
  const [speechError, setSpeechError] = useState(null);
  
  // Animation controls for the mic button
  const [micAnimation, setMicAnimation] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = sourceLanguage;

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setRecognitionError(null);
          setMicAnimation({ scale: [1, 1.2, 1], transition: { duration: 1, repeat: Infinity } });
        };

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          setInputText(transcript);
          handleTranslate(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          setRecognitionError(`Speech recognition error: ${event.error}`);
          setSnackbarMessage(`Speech recognition error: ${event.error}`);
          setSnackbarOpen(true);
          setIsListening(false);
          setMicAnimation(null);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setMicAnimation(null);
        };
      }

      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        synthesisRef.current = window.speechSynthesis;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [sourceLanguage]);

  // Enhanced translation function with AI suggestions
  const handleTranslate = async (text) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
      );
      
      if (!response.ok) throw new Error('Translation failed');
      
      const data = await response.json();
      const translatedText = data[0].map((item) => item[0]).join('');
      
      setTranslatedText(translatedText);
      
      // Generate AI suggestions
      const aiSuggestions = generateAISuggestions(text, translatedText);
      setSuggestions(aiSuggestions);
      
      // Add to history with enhanced metadata
      const newHistoryItem = {
        id: Date.now().toString(),
        sourceText: text,
        translatedText,
        sourceLang: sourceLanguage,
        targetLang: targetLanguage,
        timestamp: Date.now(),
        isFavorite: false,
        context: getContextForTranslation(text),
        tone: determineTone(text),
      };
      
      setTranslationHistory(prev => [newHistoryItem, ...prev]);
    } catch (err) {
      setError('Translation failed. Please try again.');
      setSnackbarMessage('Translation failed');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for enhanced features
  const generateAISuggestions = (source, translated) => {
    // Simulate AI suggestions (in a real app, this would call an AI service)
    const alternatives = [
      translated,
      translated.charAt(0).toUpperCase() + translated.slice(1), // Capitalized version
      translated + " (formal)",
    ];
    return alternatives;
  };

  const getContextForTranslation = (text) => {
    // Simulate context analysis
    return "This translation maintains the formal tone of the original text while preserving cultural nuances.";
  };

  const determineTone = (text) => {
    // Simple tone detection
    const formalWords = ['please', 'thank you', 'would', 'could'];
    const casualWords = ['hey', 'what\'s up', 'cool', 'awesome'];
    const slangWords = ['lit', 'sick', 'dope', 'fire'];

    if (formalWords.some(word => text.toLowerCase().includes(word))) return 'formal';
    if (slangWords.some(word => text.toLowerCase().includes(word))) return 'slang';
    return 'casual';
  };

  // Enhanced UI event handlers
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    setCharacterCount(text.length);
    
    // Debounce translation for better performance
    const timeoutId = setTimeout(() => {
      if (text.trim()) {
        handleTranslate(text);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setSnackbarMessage('Text copied to clipboard');
    setSnackbarOpen(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Enhanced speech recognition handler
  const handleStartListening = () => {
    if (!recognitionRef.current) {
      setRecognitionError('Speech recognition not supported in your browser');
      setSnackbarMessage('Speech recognition not supported');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.abort();
      } else {
        recognitionRef.current.lang = sourceLanguage;
        recognitionRef.current.start();
      }
    } catch (error) {
      setRecognitionError('Failed to start speech recognition');
      setSnackbarMessage('Failed to start speech recognition');
      setSnackbarOpen(true);
    }
  };

  // Enhanced text-to-speech handler
  const handleSpeak = () => {
    if (!synthesisRef.current) {
      setSpeechError('Text-to-speech not supported in your browser');
      setSnackbarMessage('Text-to-speech not supported');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (isSpeaking) {
        synthesisRef.current.cancel();
        setIsSpeaking(false);
      } else {
        // Cancel any ongoing speech
        synthesisRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = targetLanguage;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Get available voices and set the appropriate one
        const voices = synthesisRef.current.getVoices();
        const targetVoice = voices.find(voice => 
          voice.lang.startsWith(targetLanguage) || 
          voice.lang.includes(targetLanguage)
        );
        
        if (targetVoice) {
          utterance.voice = targetVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
          setSpeechError(null);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = (event) => {
          setSpeechError(`Speech synthesis error: ${event.error}`);
          setSnackbarMessage('Speech synthesis error');
          setSnackbarOpen(true);
          setIsSpeaking(false);
        };

        synthesisRef.current.speak(utterance);
      }
    } catch (error) {
      setSpeechError('Failed to start speech synthesis');
      setSnackbarMessage('Failed to start speech synthesis');
      setSnackbarOpen(true);
    }
  };

  const handleFavorite = (id) => {
    setTranslationHistory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleDelete = (id) => {
    setTranslationHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleHistoryItemClick = (item) => {
    setSourceLanguage(item.sourceLang);
    setTargetLanguage(item.targetLang);
    setInputText(item.sourceText);
    setTranslatedText(item.translatedText);
  };

  return (
    <DashboardLayout title="Language Translator">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#2D3748]">Language Translator</h2>
        <p className="mt-2 text-[#4A5568]">Translate text between multiple Indian languages</p>
      </div>

      <Box sx={{ width: '100%' }}>
        <Stack spacing={4}>
          <MainContainer elevation={0}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
              {/* Source Language Card */}
              <TranslationCard sx={{ flex: 1, width: '100%' }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>From</InputLabel>
                      <Select
                        value={sourceLanguage}
                        onChange={(e) => setSourceLanguage(e.target.value)}
                        label="From"
                        startAdornment={
                          <InputAdornment position="start">
                            {languages.find(l => l.code === sourceLanguage)?.flag}
                          </InputAdornment>
                        }
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography>{lang.flag}</Typography>
                              <Typography>{lang.name}</Typography>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <motion.div animate={micAnimation}>
                      <Tooltip title={isListening ? "Stop Listening" : "Start Listening"}>
                        <IconButton
                          onClick={handleStartListening}
                          sx={{
                            bgcolor: isListening ? alpha('#3f51b5', 0.2) : 'transparent',
                            '&:hover': { bgcolor: alpha('#3f51b5', 0.1) },
                          }}
                        >
                          {isListening ? <Stop /> : <KeyboardVoice />}
                        </IconButton>
                      </Tooltip>
                    </motion.div>
                  </Box>
                  <TextField
                    multiline
                    rows={6}
                    fullWidth
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Enter text to translate..."
                    inputRef={textareaRef}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        background: alpha(theme.palette.background.paper, 0.8),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: alpha(theme.palette.background.paper, 0.9),
                        },
                        '& .MuiOutlinedInput-input': {
                          color: theme.palette.text.primary,
                        },
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {characterCount} / 500 characters
                    </Typography>
                    <Chip
                      icon={<AutoFixHigh />}
                      label="AI Grammar Check"
                      size="small"
                      sx={{
                        bgcolor: alpha('#C2E9FB', 0.2),
                        '&:hover': {
                          bgcolor: alpha('#C2E9FB', 0.3),
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </TranslationCard>

              {/* Swap Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <SwapButton onClick={handleSwapLanguages}>
                  <SwapHoriz />
                </SwapButton>
              </Box>

              {/* Target Language Card */}
              <TranslationCard sx={{ flex: 1, width: '100%' }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>To</InputLabel>
                      <Select
                        value={targetLanguage}
                        onChange={(e) => setTargetLanguage(e.target.value)}
                        label="To"
                        startAdornment={
                          <InputAdornment position="start">
                            {languages.find(l => l.code === targetLanguage)?.flag}
                          </InputAdornment>
                        }
                      >
                        {languages.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography>{lang.flag}</Typography>
                              <Typography>{lang.name}</Typography>
                            </Stack>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={isSpeaking ? "Stop Speaking" : "Listen"}>
                        <IconButton
                          onClick={handleSpeak}
                          sx={{
                            bgcolor: isSpeaking ? alpha('#3f51b5', 0.2) : 'transparent',
                            '&:hover': { bgcolor: alpha('#3f51b5', 0.1) },
                          }}
                        >
                          {isSpeaking ? <Stop /> : <VolumeUp />}
                        </IconButton>
                      </Tooltip>
                      <IconButton
                        onClick={handleCopy}
                        sx={{
                          bgcolor: copied ? alpha('#3f51b5', 0.2) : 'transparent',
                          '&:hover': { bgcolor: alpha('#3f51b5', 0.1) },
                        }}
                      >
                        {copied ? <Check color="primary" /> : <ContentCopy />}
                      </IconButton>
                    </Stack>
                  </Box>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      minHeight: 200,
                      borderRadius: 2,
                      background: alpha(theme.palette.background.paper, 0.8),
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: alpha(theme.palette.background.paper, 0.9),
                      },
                      '& .MuiTypography-root': {
                        color: theme.palette.text.primary,
                      },
                    }}
                  >
                    {isLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Typography>{translatedText || 'Translation will appear here...'}</Typography>
                    )}
                  </Paper>
                  {suggestions.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        AI Suggestions
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        {suggestions.map((suggestion, index) => (
                          <SuggestionChip
                            key={index}
                            label={suggestion}
                            onClick={() => setTranslatedText(suggestion)}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </TranslationCard>
            </Stack>

            {/* History and Favorites Section */}
            <Box sx={{ mt: 4 }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{ mb: 2 }}
              >
                <Tab
                  icon={<History />}
                  label="History"
                  iconPosition="start"
                />
                <Tab
                  icon={<Favorite />}
                  label="Favorites"
                  iconPosition="start"
                />
              </Tabs>

              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                <AnimatePresence>
                  {translationHistory
                    .filter(item => activeTab === 0 || (activeTab === 1 && item.isFavorite))
                    .map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <HistoryItem>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ flex: 1 }} onClick={() => handleHistoryItemClick(item)}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle2" color="text.secondary">
                                  {languages.find(l => l.code === item.sourceLang)?.flag}
                                  {' → '}
                                  {languages.find(l => l.code === item.targetLang)?.flag}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={item.tone}
                                  sx={{
                                    bgcolor: alpha('#A1C4FD', 0.2),
                                  }}
                                />
                              </Stack>
                              <Typography variant="body2" noWrap>
                                {item.sourceText}
                              </Typography>
                              <Typography variant="body2" color="primary" noWrap>
                                {item.translatedText}
                              </Typography>
                              {item.context && (
                                <Typography variant="caption" color="text.secondary">
                                  {item.context}
                                </Typography>
                              )}
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleFavorite(item.id)}
                                sx={{
                                  color: item.isFavorite ? '#A1C4FD' : 'inherit',
                                }}
                              >
                                {item.isFavorite ? <Favorite /> : <FavoriteBorder />}
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Delete />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </HistoryItem>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </Box>
            </Box>
          </MainContainer>
        </Stack>
      </Box>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-[#E2E8F0]">
          <div className="flex items-center mb-4">
            <Language className="text-[#1A2B6D] mr-3" style={{ fontSize: 30 }} />
            <h3 className="text-xl font-bold text-[#2D3748]">Multiple Languages</h3>
          </div>
          <p className="text-[#4A5568]">
            Translate between 10+ Indian languages with high accuracy and natural-sounding results.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-[#E2E8F0]">
          <div className="flex items-center mb-4">
            <VolumeUp className="text-[#009688] mr-3" style={{ fontSize: 30 }} />
            <h3 className="text-xl font-bold text-[#2D3748]">Speech Features</h3>
          </div>
          <p className="text-[#4A5568]">
            Use voice input and listen to translations with our advanced speech recognition and synthesis.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-[#E2E8F0]">
          <div className="flex items-center mb-4">
            <TranslateIcon className="text-[#FF5722] mr-3" style={{ fontSize: 30 }} />
            <h3 className="text-xl font-bold text-[#2D3748]">Smart Translation</h3>
          </div>
          <p className="text-[#4A5568]">
            AI-powered translations understand context and provide multiple accurate alternatives.
          </p>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        TransitionComponent={Slide}
      />

      {/* AI Help Panel */}
      <Collapse in={showAIHelp}>
        <Paper
          elevation={0}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha('#3f51b5', 0.95)} 0%, ${alpha('#2196f3', 0.95)} 100%)`,
            backdropFilter: 'blur(12px)',
            maxWidth: 300,
            color: 'white',
            zIndex: 1000,
          }}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle1" color="white">
              Translation Assistant
            </Typography>
            <Typography variant="body2" color="white">
              I can help you with translations, cultural context, and language nuances.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<TranslateIcon />}
              onClick={() => setShowAIHelp(false)}
            >
              Got it
            </Button>
          </Stack>
        </Paper>
      </Collapse>
    </DashboardLayout>
  );
}
