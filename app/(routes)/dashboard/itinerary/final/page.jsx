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
  Grid,
  CircularProgress,
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack,
  Map as MapIcon,
  MenuOpen,
  Flight,
  DirectionsCar,
  Directions,
  Hotel,
  Restaurant,
  EventNote,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import map dynamically to avoid SSR issues with correct path
const JourneyMap = dynamic(() => import('../../../../../components/JourneyMap'), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  )
});

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

export default function FinalItineraryPage() {
  const router = useRouter();
  const [itineraryData, setItineraryData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoading, setMapLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    // Load the selected itinerary from localStorage
    const storedData = localStorage.getItem('finalItinerary') || localStorage.getItem('generatedItinerary')?.itineraries?.first;
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setItineraryData(parsedData);
      } catch (error) {
        console.error('Error parsing itinerary data:', error);
      }
    }
    
    // Fetch map data from API
    const fetchMapData = async () => {
      setMapLoading(true);
      try {
        const response = await fetch('https://eb80-2401-4900-5091-57d6-1ca2-ef04-2f72-77dd.ngrok-free.app/map');
        const data = await response.json();
        
        // Parse the travel_plan from the string format
        if (data && data.travel_plan) {
          const travelPlanString = data.travel_plan;
          // Extract JSON from the markdown code block
          const jsonMatch = travelPlanString.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            const parsedMapData = JSON.parse(jsonMatch[1]);
            setMapData(parsedMapData);
          }
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
        // Fallback to default map data if API fails
      } finally {
        setMapLoading(false);
      }
    };
    
    fetchMapData();
    setLoading(false);
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
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
      <DashboardLayout title="Your Itinerary">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Your Perfect Itinerary">
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                Your Finalized Travel Plan
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your personalized itinerary for an unforgettable journey
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/dashboard/itinerary/results')}
            >
              Back to Options
            </Button>
          </Box>

          {/* Journey Map Section */}
          <StyledPaper elevation={3} sx={{ height: '40vh', p: 0, overflow: 'hidden', position: 'relative', mb: 3 }}>
            {mapLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ height: '100%', width: '100%' }}>
                <JourneyMap segments={mapData} />
              </Box>
            )}
            
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                right: 10, 
                bgcolor: 'white',
                boxShadow: 2,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.8)' }
              }}
              onClick={toggleDrawer}
            >
              <MenuOpen />
            </IconButton>
          </StyledPaper>

          <Grid container spacing={2}>
            {/* Itinerary Column */}
            <Grid item xs={12}>
              <StyledPaper elevation={3} sx={{ height: '50vh', overflow: 'auto' }}>
                <ItineraryContent 
                  dangerouslySetInnerHTML={{ 
                    __html: convertTextToHtml(itineraryData) 
                  }} 
                />
              </StyledPaper>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              startIcon={<MapIcon />}
              sx={{
                px: 4, 
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1A2B6D 0%, #4C63B6 100%)',
                boxShadow: '0 4px 16px rgba(26, 43, 109, 0.3)',
              }}
              onClick={() => window.print()}
            >
              Download Itinerary
            </Button>
          </Box>
        </motion.div>

        {/* Side Drawer for Journey Details */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          PaperProps={{
            sx: { width: { xs: '80%', sm: '400px' }, p: 2 }
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>Journey Details</Typography>
            <Typography variant="body2" color="text.secondary">Your travel route breakdown</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {mapData && mapData.map((segment, index) => (
              <ListItem key={index} sx={{ mb: 1, display: 'block' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {segment.mode === 'plane' ? <Flight color="primary" /> : 
                     segment.mode === 'car' ? <DirectionsCar color="info" /> : 
                     <Directions color="warning" />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={segment.title} 
                    secondary={segment.description}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </Box>
                {index < mapData.length - 1 && (
                  <Box sx={{ borderLeft: '2px dashed #ccc', height: 20, ml: 2.5, my: 0.5 }} />
                )}
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Container>
    </DashboardLayout>
  );
}
