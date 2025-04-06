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
  Divider,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  LocationOn, 
  CalendarToday, 
  Hotel, 
  DirectionsCar,
  LocalActivity,
  Restaurant,
  ArrowBack
} from '@mui/icons-material';
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

const DayCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  overflow: 'visible',
  position: 'relative',
}));

const DayBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -15,
  left: 20,
  background: theme.palette.primary.main,
  color: '#fff',
  borderRadius: 20,
  padding: '5px 15px',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export default function ItineraryResultsPage() {
  const router = useRouter();
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the generated itinerary data from localStorage
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

  if (loading) {
    return (
      <DashboardLayout title="Itinerary Results">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (!itineraryData) {
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
                Your Personalized Itinerary
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We've crafted this journey specially for you
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
        
          <Grid container spacing={4}>
            {/* Left column - Itinerary Overview */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <StyledPaper>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Trip Summary
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Destination" 
                        secondary={`${itineraryData.fromLocation || 'N/A'} to ${itineraryData.toLocation || 'N/A'}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarToday color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Travel Period" 
                        secondary={itineraryData.duration || 'N/A'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Hotel color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Accommodations" 
                        secondary={itineraryData.accommodation_type || 'Standard Hotels'} 
                      />
                    </ListItem>
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Budget Breakdown
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Total Budget" 
                        secondary={`₹${itineraryData.totalBudget?.toLocaleString() || 'N/A'}`} 
                      />
                    </ListItem>
                  </List>
                </StyledPaper>
              </motion.div>
            </Grid>
            
            {/* Right column - Detailed Day-by-Day Itinerary */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ ml: 2 }}>
                  Day-by-Day Itinerary
                </Typography>
                
                {itineraryData.days && itineraryData.days.map((day, index) => (
                  <DayCard key={index}>
                    <DayBadge>Day {index + 1}</DayBadge>
                    <CardContent sx={{ pt: 4 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {day.title || `Day ${index + 1}`}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        {day.description || "Details for this day's activities."}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {day.activities && day.activities.map((activity, actIdx) => (
                          <Grid item xs={12} key={actIdx}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                              <LocalActivity color="primary" sx={{ mt: 0.5 }} />
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {activity.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {activity.description}
                                </Typography>
                                {activity.time && (
                                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Time: {activity.time}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                      
                      {day.meals && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Meals
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Restaurant fontSize="small" color="action" />
                            <Typography variant="body2">
                              {day.meals}
                            </Typography>
                          </Box>
                        </>
                      )}
                      
                      {day.accommodation && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Accommodation
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Hotel fontSize="small" color="action" />
                            <Typography variant="body2">
                              {day.accommodation}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </DayCard>
                ))}
                
                {(!itineraryData.days || itineraryData.days.length === 0) && (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      Itinerary details not available. Please try generating again.
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    sx={{
                      px: 4, 
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #1A2B6D 0%, #4C63B6 100%)',
                    }}
                  >
                    Download Itinerary PDF
                  </Button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </DashboardLayout>
  );
}
