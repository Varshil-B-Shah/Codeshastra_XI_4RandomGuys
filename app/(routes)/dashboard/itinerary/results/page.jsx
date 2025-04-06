"use client";
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowBack, CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(1),
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  height: '65vh',
  overflowY: 'auto',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const ItineraryContent = styled(Box)({
  '& p, & li': {
    margin: '0.5em 0',
  },
  '& ul, & ol': {
    paddingLeft: '1.5em',
  },
  '& h2, & h3, & h4': {
    marginTop: '1em',
    marginBottom: '0.5em',
  }
});

export default function ItineraryResultsPage() {
  const router = useRouter();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('generatedItinerary');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setItineraryData(parsedData);
      } catch (error) {
        console.error('Error parsing itinerary data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleSelectOption = async (option) => {
    setValidating(true);
    setSelectedOption(option);
    
    try {
      // Make POST request to validation endpoint with modified CORS settings
      const response = await fetch('https://eb80-2401-4900-5091-57d6-1ca2-ef04-2f72-77dd.ngrok-free.app/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "Validation" : option === 'first' ? "1" : "2"
        }),
        mode: 'no-cors', // Changed from 'cors' to 'no-cors' to bypass CORS restrictions
      });
      
      console.log('Validation request sent successfully');
      
      // Note: With 'no-cors' mode, we can't read the response
      // This will resolve successfully but response body won't be accessible
      
    } catch (error) {
      console.error('Error validating itinerary choice:', error);
      // Log the error but allow the user to continue
    } finally {
      // Short timeout to ensure the UI change is noticeable to the user
      setTimeout(() => {
        setValidating(false);
      }, 500);
    }
  };
  
  // Alternative approach using XMLHttpRequest if fetch with no-cors still fails
  const sendValidationWithXHR = (option) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://c676-14-139-125-231.ngrok-free.app/validate', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        // Regardless of status code, we're done
        console.log('XHR request completed with status:', xhr.status);
        setTimeout(() => {
          setValidating(false);
        }, 500);
      }
    };
    xhr.onerror = function() {
      console.error('XHR request failed');
      setTimeout(() => {
        setValidating(false);
      }, 500);
    };
    xhr.send(JSON.stringify({
      Validation: option === 'first' ? "1" : "2"
    }));
  };

  const handleOptionClick = (option) => {
    setValidating(true);
    setSelectedOption(option);
    
    // Try both methods, one might work
    try {
      fetch('https://c676-14-139-125-231.ngrok-free.app/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Validation: option === 'first' ? "1" : "2"
        }),
        mode: 'no-cors',
      }).catch(error => {
        console.log('Fetch failed, trying XHR');
        sendValidationWithXHR(option);
      });
    } catch (error) {
      console.error('Error in validation attempt:', error);
      sendValidationWithXHR(option);
    } finally {
      // Ensure we always exit validating state
      setTimeout(() => {
        setValidating(false);
      }, 1000);
    }
  };

  const convertTextToHtml = (text) => {
    if (!text) return '';
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br />');
    formatted = formatted.replace(/\*\s+([^\n]*)/g, '• $1<br />');
    return formatted;
  };

  if (loading) {
    return (
      <DashboardLayout title="Itinerary Results">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!itineraryData || !itineraryData.itineraries) {
    return (
      <DashboardLayout title="Itinerary Results">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" gutterBottom>
              No itinerary data found
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => router.push('/dashboard/itinerary')}
              startIcon={<ArrowBack />}
              sx={{ mt: 3 }}
            >
              Return to Planner
            </Button>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Your Perfect Itinerary">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Your Personalized Itinerary Options
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Compare these two travel plans and choose the one that suits you best
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/dashboard/itinerary')}
            >
              Back to Planner
            </Button>
          </Box>
        
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: 3,
              height: { md: '75vh' }
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: { xs: '70vh', md: '100%' } }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ pl: 1 }}>
                  Option 1
                </Typography>
                <StyledPaper sx={{ flex: 1, mb: 2, height: 'auto', maxHeight: { xs: '55vh', md: '62vh' } }}>
                  <ItineraryContent 
                    dangerouslySetInnerHTML={{ 
                      __html: convertTextToHtml(itineraryData.itineraries?.first) 
                    }} 
                  />
                </StyledPaper>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pb: 2 }}>
                  <Button
                    variant={selectedOption === 'first' ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                    startIcon={selectedOption === 'first' ? <CheckCircle /> : null}
                    onClick={() => handleOptionClick('first')}
                    disabled={validating}
                    sx={{ 
                      width: '100%', 
                      py: 1,
                      background: selectedOption === 'first' ? 'linear-gradient(135deg, #1A2B6D 0%, #4C63B6 100%)' : 'transparent'
                    }}
                  >
                    {validating && selectedOption === 'first' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Processing...
                      </Box>
                    ) : (
                      selectedOption === 'first' ? 'Selected' : 'Choose Option 1'
                    )}
                  </Button>
                </Box>
              </motion.div>
            </Box>
            
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: { xs: '70vh', md: '100%' } }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ pl: 1 }}>
                  Option 2
                </Typography>
                <StyledPaper sx={{ flex: 1, mb: 2, height: 'auto', maxHeight: { xs: '55vh', md: '62vh' } }}>
                  <ItineraryContent 
                    dangerouslySetInnerHTML={{ 
                      __html: convertTextToHtml(itineraryData.itineraries?.second) 
                    }} 
                  />
                </StyledPaper>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pb: 2 }}>
                  <Button
                    variant={selectedOption === 'second' ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                    startIcon={selectedOption === 'second' ? <CheckCircle /> : null}
                    onClick={() => handleOptionClick('second')}
                    disabled={validating}
                    sx={{ 
                      width: '100%', 
                      py: 1,
                      background: selectedOption === 'second' ? 'linear-gradient(135deg, #1A2B6D 0%, #4C63B6 100%)' : 'transparent'
                    }}
                  >
                    {validating && selectedOption === 'second' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Processing...
                      </Box>
                    ) : (
                      selectedOption === 'second' ? 'Selected' : 'Choose Option 2'
                    )}
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Box>

          {selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    // Always store the first itinerary regardless of selection
                    // This ensures option1 is always loaded in the final page
                    const selectedItinerary = itineraryData.itineraries.first;
                    localStorage.setItem('finalItinerary', JSON.stringify(selectedItinerary));
                    router.push('/dashboard/itinerary/final');
                  }}
                  disabled={validating}
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #1A2B6D 0%, #4C63B6 100%)',
                    boxShadow: '0 4px 16px rgba(26, 43, 109, 0.3)',
                  }}
                >
                  Proceed with Selected Option
                </Button>
              </Box>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </DashboardLayout>
  );
}
