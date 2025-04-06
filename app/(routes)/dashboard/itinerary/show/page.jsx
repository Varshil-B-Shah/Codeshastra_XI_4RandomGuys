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
import { ArrowBack, Download } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(3),
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
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

export default function ShowItineraryPage() {
  const router = useRouter();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch itinerary data from the backend
    const fetchItineraryData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://8518-14-139-125-231.ngrok-free.app/show');
        
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        
        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server");
        }
        
        const data = await response.json();
        
        if (data && data.itinerary) {
          setItineraryData(data.itinerary);
        } else {
          console.log("API returned data but no itinerary found", data);
          fallbackToLocalStorage();
        }
      } catch (error) {
        console.error('Error fetching itinerary data:', error);
        setError(`Failed to load itinerary data: ${error.message}`);
        fallbackToLocalStorage();
      } finally {
        setLoading(false);
      }
    };
    
    // Helper function to load data from localStorage
    const fallbackToLocalStorage = () => {
      console.log("Falling back to localStorage data");
      const storedData = localStorage.getItem('finalItinerary') || localStorage.getItem('generatedItinerary');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setItineraryData(parsedData);
        } catch (error) {
          console.error('Error parsing stored itinerary data:', error);
          setError("Could not parse stored itinerary data");
        }
      } else {
        console.log("No data found in localStorage");
      }
    };
    
    fetchItineraryData();
  }, []);

  const convertTextToHtml = (text) => {
    if (!text) return '';
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br />');
    formatted = formatted.replace(/\*\s+([^\n]*)/g, '• $1<br />');
    return formatted;
  };

  const handlePrintItinerary = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout title="Your Itinerary">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Your Travel Itinerary">
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Your Travel Plan
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your personalized itinerary for an unforgettable journey
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Box>

          {/* Itinerary Content */}
          <StyledPaper elevation={3} sx={{ minHeight: '60vh', overflow: 'auto' }}>
            {itineraryData ? (
              <ItineraryContent 
                dangerouslySetInnerHTML={{ 
                  __html: convertTextToHtml(itineraryData) 
                }} 
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No itinerary data available
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push('/dashboard/itinerary')}
                  sx={{ mt: 3 }}
                >
                  Create an Itinerary
                </Button>
              </Box>
            )}
          </StyledPaper>

          {itineraryData && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                startIcon={<Download />}
                sx={{
                  px: 4, 
                  py: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #1A2B6D 0%, #4C63B6 100%)',
                  boxShadow: '0 4px 16px rgba(26, 43, 109, 0.3)',
                }}
                onClick={handlePrintItinerary}
              >
                Download Itinerary
              </Button>
            </Box>
          )}
        </motion.div>
      </Container>
    </DashboardLayout>
  );
}