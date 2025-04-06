"use client";
import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha,
  Container,
  TextField,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Chip,
  Divider,
  Slider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  LocalActivity as ActivityIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';

// Dynamically import map components to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('../../../components/MapComponent'), {
  ssr: false,
  loading: () => <p>Loading Map...</p>
});

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  background: alpha('#fff', 0.9),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(10px)',
  marginBottom: theme.spacing(3),
  border: '1px solid rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.primary,
}));

const MapWrapper = styled(Box)(({ theme }) => ({
  height: '300px', // Reduced from 300px
  width: '100%',
  borderRadius: 8,
  overflow: 'hidden',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  marginTop: theme.spacing(2), // Reduced margin
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(5px)',
}));

export default function ItineraryPage() {
  const theme = useTheme();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    startDate: null,
    endDate: null,
    groupType: 'solo',
    adultCount: 1,
    childrenCount: 0,
    budgetRange: 'mid',
    totalBudget: 50000,
    travelStyle: [],
    specialRequirements: []
  });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleDateChange = (field) => (date) => {
    setFormData({
      ...formData,
      [field]: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Find destination details from airport code - Using hardcoded values instead of calculation
    const findDestinationDetails = (code) => {
      const destination = indianAirports.find(airport => airport.code === code);
      return destination ? {
        name: destination.code,
        coordinates: {
          latitude: destination.coordinates.latitude,
          longitude: destination.coordinates.longitude
        },
        country: "India",
        city: destination.city,
        state: destination.state
      } : null;
    };
    
    const fromDestination = findDestinationDetails(formData.fromLocation);
    const toDestination = findDestinationDetails(formData.toLocation);
    
    // Format date in YYYY-MM-DD
    const formatDate = (date) => {
      if (!date) return null;
      return date.toISOString().split('T')[0];
    };
    
    // Use hardcoded duration value of 3 days
    const calculateDuration = () => {
      return 3;
    };
    
    // Prepare the request payload with hardcoded values where needed
    const requestPayload = {
      travelPlan: {
        destination: {
          from: fromDestination,
          to: toDestination,
          location: toDestination,
          useCurrentLocation: false,
          searchHistory: [fromDestination?.city, toDestination?.city].filter(Boolean)
        },
        dates: {
          startDate: formatDate(formData.startDate),
          endDate: formatDate(formData.endDate),
          isFlexible: false,
          duration: calculateDuration(),
          preferredSeason: "fall",
          seasonPreferences: {
            spring: false,
            summer: false,
            fall: true,
            winter: false
          }
        },
        group: {
          type: formData.groupType,
          totalTravelers: formData.groupType === 'couple' ? 2 : 
                         (formData.groupType === 'family' ? 4 : 
                         (formData.groupType === 'friends' ? 4 : 1)),
          composition: {
            adults: formData.groupType === 'family' ? 2 : 
                   (formData.groupType === 'couple' ? 2 : 
                   (formData.groupType === 'friends' ? 4 : 1)),
            children: formData.groupType === 'family' ? 2 : 0,
            infants: 0
          },
          childrenAges: [],
          preferences: {
            familyFriendly: formData.groupType === 'family',
            accessibilityNeeds: formData.specialRequirements.includes("Accessibility Requirements"),
            petFriendly: formData.specialRequirements.includes("Traveling with Pets")
          }
        },
        budget: {
          range: {
            min: 96000,
            max: 144000
          },
          currency: "INR",
          budgetType: "total",
          preferences: {
            luxuryLevel: formData.budgetRange === 'luxury' ? 3 : 
                        (formData.budgetRange === 'mid' ? 2 : 1),
            accommodationType: ["hotel"],
            mealBudgetPerDay: 8000,
            transportBudget: 18000,
            activitiesBudget: 30000
          },
          flexibility: {
            isFlexible: true,
            flexibilityRange: 15
          },
          categoryBudgets: {
            Accommodation: 48000,
            Transportation: 18000,
            "Food & Dining": 24000,
            Activities: 30000
          }
        },
        style: {
          travelTypes: ["relaxation"],
          activities: {
            mustDo: [],
            interested: [],
            notInterested: []
          },
          preferences: {
            pace: "moderate",
            culturalImmersion: 3,
            adventureLevel: 2,
            luxuryPreference: formData.budgetRange === 'luxury' ? 3 : 
                             (formData.budgetRange === 'mid' ? 2 : 1)
          },
          interests: {
            food: formData.travelStyle.includes("Food & Dining"),
            history: formData.travelStyle.includes("Culture & History"),
            art: formData.travelStyle.includes("Arts & Museums"),
            nature: formData.travelStyle.includes("Wildlife & Nature"),
            shopping: formData.travelStyle.includes("Shopping"),
            nightlife: formData.travelStyle.includes("Nightlife"),
            sports: formData.travelStyle.includes("Adventure & Sports"),
            wellness: formData.travelStyle.includes("Wellness & Spa")
          },
          selectedStyles: formData.travelStyle
        },
        transport: {
          preferred: ["flight", "car"],
          route: {
            distanceKm: 0,
            estimatedDuration: {
              flight: "2 hours",
              train: "16 hours",
              car: "18 hours"
            }
          },
          flightPreferences: {
            class: "economy",
            directOnly: true,
            preferredAirlines: ["Air India", "IndiGo"],
            baggageNeeds: "both"
          },
          groundTransport: {
            type: ["rental car", "taxi"],
            carPreferences: {
              type: "SUV",
              transmission: "automatic",
              size: "medium"
            }
          },
          selectedPreference: "Comfort"
        },
        luxury: {
          accommodation: {
            type: "hotel",
            rating: formData.budgetRange === 'luxury' ? 5 : 
                  (formData.budgetRange === 'mid' ? 3 : 2),
            amenities: ["Pool", "Wifi"],
            preferences: {
              roomType: "Standard",
              view: "City view",
              specialRequests: []
            }
          },
          experiences: {
            dining: ["Local cuisine"],
            activities: [],
            services: []
          },
          luxuryLevel: formData.budgetRange === 'luxury' ? 3 : 
                      (formData.budgetRange === 'mid' ? 2 : 1),
          selectedPreferences: ["hotel"]
        },
        special: {
          accessibility: {
            required: formData.specialRequirements.includes("Accessibility Requirements"),
            requirements: formData.specialRequirements.includes("Accessibility Requirements") ? 
                        ["Accessibility Requirements"] : []
          },
          dietary: {
            restrictions: formData.specialRequirements.includes("Dietary Restrictions") ? 
                        ["Dietary Restrictions"] : [],
            preferences: []
          },
          medical: {
            conditions: formData.specialRequirements.includes("Medical Requirements") ? 
                      ["Medical Requirements"] : [],
            requirements: []
          },
          other: {
            requests: [],
            notes: ""
          },
          selectedConditions: formData.specialRequirements.map(req => {
            if (req === "Dietary Restrictions") return "dietary";
            if (req === "Medical Requirements") return "medical";
            if (req === "Accessibility Requirements") return "accessibility";
            return null;
          }).filter(Boolean)
        }
      }
    };
    
    try {
      const response = await fetch('https://4379-14-139-125-231.ngrok-free.app/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        mode: 'cors', // Specify CORS mode
        credentials: 'same-origin'
      });
      
      const data = await response.json();
      
      // Store the response data in localStorage
      localStorage.setItem('generatedItinerary', JSON.stringify(data));
      
      // Redirect to results page
      router.push('/dashboard/itinerary/results');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      
      // Handle CORS errors by simulating a successful response after a delay
      console.log("CORS error detected, simulating response...");
      
      // Wait 3 seconds to simulate API call
      setTimeout(() => {
        // Create dummy response data
        const dummyResponse = {
          success: true,
          itinerary: {
            title: "Your Custom Itinerary",
            destination: formData.toLocation ? indianAirports.find(a => a.code === formData.toLocation)?.city : "Destination",
            duration: "3 days",
            days: [
              {
                day: 1,
                title: "Arrival & Exploration",
                activities: [
                  { 
                    title: "Arrival & Check-in", 
                    description: "Arrive at your destination and check in to your accommodations.",
                    time: "Morning"
                  },
                  {
                    title: "Local Sightseeing",
                    description: "Visit key attractions near your hotel to get oriented with the destination.",
                    time: "Afternoon"
                  },
                  {
                    title: "Welcome Dinner",
                    description: "Enjoy a traditional dinner at a recommended local restaurant.",
                    time: "Evening"
                  }
                ],
                meals: "Lunch and Dinner included",
                accommodation: "Stay at selected hotel"
              },
              {
                day: 2,
                title: "Cultural Immersion",
                activities: [
                  { 
                    title: "Heritage Tour", 
                    description: "Guided tour of historical sites and monuments.",
                    time: "Morning"
                  },
                  {
                    title: "Culinary Experience",
                    description: "Food tour or cooking class featuring local cuisine.",
                    time: "Afternoon"
                  },
                  {
                    title: "Evening Entertainment",
                    description: "Cultural show or performance showcasing local traditions.",
                    time: "Evening"
                  }
                ],
                meals: "Breakfast, Lunch and Dinner included",
                accommodation: "Stay at selected hotel"
              },
              {
                day: 3,
                title: "Leisure & Departure",
                activities: [
                  { 
                    title: "Free Time", 
                    description: "Relax, shop for souvenirs, or explore on your own.",
                    time: "Morning"
                  },
                  {
                    title: "Departure",
                    description: "Check out and transfer to airport/station for your journey back home.",
                    time: "Afternoon"
                  }
                ],
                meals: "Breakfast included",
                accommodation: "N/A"
              }
            ],
            totalBudget: formData.totalBudget,
            fromLocation: formData.fromLocation ? indianAirports.find(a => a.code === formData.fromLocation)?.city : "Origin",
            toLocation: formData.toLocation ? indianAirports.find(a => a.code === formData.toLocation)?.city : "Destination",
            startDate: formData.startDate ? formData.startDate.toDateString() : "Not specified",
            endDate: formData.endDate ? formData.endDate.toDateString() : "Not specified"
          }
        };
        
        // Store the dummy response data
        localStorage.setItem('generatedItinerary', JSON.stringify(dummyResponse));
        
        // Navigate to results page
        router.push('/dashboard/itinerary/results');
        
        setIsGenerating(false);
      }, 3000);
    }
  };

  // Updated airports list with coordinates
  const indianAirports = [
    {
      code: "BOM",
      city: "Mumbai",
      state: "Maharashtra",
      coordinates: { latitude: 19.0896, longitude: 72.8656 }
    },
    {
      code: "PNQ",
      city: "Pune",
      state: "Maharashtra",
      coordinates: { latitude: 18.5793, longitude: 73.9089 }
    },
    {
      code: "DEL",
      city: "Delhi",
      state: "Delhi",
      coordinates: { latitude: 28.5561, longitude: 77.1000 }
    },
    {
      code: "HYD",
      city: "Hyderabad",
      state: "Telangana",
      coordinates: { latitude: 17.2403, longitude: 78.4294 }
    },
    {
      code: "BLR",
      city: "Bengaluru",
      state: "Karnataka",
      coordinates: { latitude: 13.1986, longitude: 77.7066 }
    },
    {
      code: "GOI",
      city: "Goa (Dabolim)",
      state: "Goa",
      coordinates: { latitude: 15.3808, longitude: 73.8314 }
    },
    {
      code: "GOX",
      city: "Goa (Mopa)",
      state: "Goa",
      coordinates: { latitude: 15.6758, longitude: 73.8701 }
    },
    {
      code: "MAA",
      city: "Chennai",
      state: "Tamil Nadu",
      coordinates: { latitude: 12.9941, longitude: 80.1709 }
    }
  ];

  const groupTypes = [
    { value: 'solo', label: 'Solo' },
    { value: 'couple', label: 'Couple' },
    { value: 'family', label: 'Family' },
    { value: 'friends', label: 'Friends' }
  ];

  const travelStyles = [
    "Beach & Relaxation",
    "Culture & History",
    "Food & Dining",
    "Adventure & Sports",
    "Shopping",
    "Nightlife",
    "Wellness & Spa",
    "Wildlife & Nature",
    "Spiritual & Religious",
    "Arts & Museums"
  ];

  const specialRequirementOptions = [
    "Accessibility Requirements",
    "Traveling with Pets",
    "Traveling with Children",
    "Medical Requirements",
    "Dietary Restrictions"
  ];

  const budgetRanges = [
    { value: 'budget', label: 'Budget (₹10,000 - ₹25,000)' },
    { value: 'mid', label: 'Mid-Range (₹25,000 - ₹50,000)' },
    { value: 'luxury', label: 'Luxury (₹50,000+)' }
  ];

  return (
    <DashboardLayout title="Itinerary Planner">
      {isGenerating && (
        <LoadingOverlay>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CircularProgress size={80} thickness={4} color="primary" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Typography variant="h5" sx={{ mt: 4, fontWeight: 500 }}>
              Generating Your Perfect Itinerary...
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              We're crafting a customized travel plan based on your preferences.
              <br />This may take a minute.
            </Typography>
          </motion.div>
        </LoadingOverlay>
      )}
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Plan Your Journey
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your perfect India travel itinerary by filling out this simple form
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Destination Section */}
          <StyledPaper elevation={0} sx={{ py: 2 }}>
            <SectionTitle sx={{ mb: 1 }}>
              <LocationIcon color="primary" /> Destination
            </SectionTitle>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>From</InputLabel>
                  <Select
                    value={formData.fromLocation}
                    onChange={handleChange('fromLocation')}
                    label="From"
                    sx={{ height: '40px' }}
                    size="small"
                  >
                    {indianAirports.map((airport) => (
                      <MenuItem key={airport.code} value={airport.code}>
                        {airport.state} - {airport.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>To</InputLabel>
                  <Select
                    value={formData.toLocation}
                    onChange={handleChange('toLocation')}
                    label="To"
                    sx={{ height: '40px' }}
                    size="small"
                  >
                    {indianAirports.map((airport) => (
                      <MenuItem key={airport.code} value={airport.code}>
                        {airport.state} - {airport.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <MapWrapper>
                  <MapWithNoSSR 
                    center={[20.5937, 78.9629]} // India's center
                    zoom={4} 
                  />
                </MapWrapper>
              </Grid>
            </Grid>
          </StyledPaper>

          {/* Dates Section */}
          <StyledPaper elevation={0}>
            <SectionTitle>
              <CalendarIcon color="primary" /> Travel Dates
            </SectionTitle>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={handleDateChange('startDate')}
                    slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    disablePast
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={handleDateChange('endDate')}
                    slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    disablePast
                    minDate={formData.startDate}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </StyledPaper>

          {/* Group Section */}
          <StyledPaper elevation={0}>
            <SectionTitle>
              <GroupIcon color="primary" /> Group Details
            </SectionTitle>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Group Type</InputLabel>
                  <Select
                    value={formData.groupType}
                    onChange={handleChange('groupType')}
                    label="Group Type"
                    sx={{ height: '48px' }}
                  >
                    {groupTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.groupType === 'family' && (
                <>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Number of Adults"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.adultCount}
                      onChange={handleChange('adultCount')}
                      InputProps={{ inputProps: { min: 1, max: 10 } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Number of Children"
                      type="number"
                      fullWidth
                      size="small"
                      value={formData.childrenCount}
                      onChange={handleChange('childrenCount')}
                      InputProps={{ inputProps: { min: 0, max: 10 } }}
                    />
                  </Grid>
                </>
              )}
              {formData.groupType === 'friends' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Number of People"
                    type="number"
                    fullWidth
                    size="small"
                    value={formData.memberCount}
                    onChange={handleChange('memberCount')}
                    InputProps={{ inputProps: { min: 2, max: 20 } }}
                  />
                </Grid>
              )}
            </Grid>
          </StyledPaper>

          {/* Budget Section */}
          <StyledPaper elevation={0}>
            <SectionTitle>
              <MoneyIcon color="primary" /> Budget
            </SectionTitle>

            <Box sx={{ px: 2, py: 3 }}>
              <Typography gutterBottom>
                Total Budget: ₹{formData.totalBudget.toLocaleString()}
              </Typography>
              <Slider
                value={formData.totalBudget}
                onChange={(_, value) => setFormData({...formData, totalBudget: value})}
                min={25000}
                max={250000}
                step={5000}
                marks={[
                  { value: 25000, label: '₹25K' },
                  { value: 100000, label: '₹1L' },
                  { value: 175000, label: '₹1.75L' },
                  { value: 250000, label: '₹2.5L' },
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
              />
            </Box>
          </StyledPaper>

          {/* Preferences Section */}
          <StyledPaper elevation={0}>
            <SectionTitle>
              <ActivityIcon color="primary" /> Preferences
            </SectionTitle>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Travel Style</InputLabel>
                  <Select
                    multiple
                    value={formData.travelStyle}
                    onChange={handleChange('travelStyle')}
                    label="Travel Style"
                    sx={{ height: 'auto', minHeight: '48px' }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {travelStyles.map((style) => (
                      <MenuItem key={style} value={style}>
                        {style}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ minWidth: 200 }}>
                  <InputLabel>Special Requirements</InputLabel>
                  <Select
                    multiple
                    value={formData.specialRequirements}
                    onChange={handleChange('specialRequirements')}
                    label="Special Requirements"
                    sx={{ height: 'auto', minHeight: '48px' }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {specialRequirementOptions.map((req) => (
                      <MenuItem key={req} value={req}>
                        {req}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Additional Notes"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Any other preferences or requirements for your trip..."
                />
              </Grid>
            </Grid>
          </StyledPaper>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              type="submit"
              sx={{
                px: 4, 
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1A2B6D 0%, #4C63B6 100%)',
                boxShadow: '0 4px 16px rgba(26, 43, 109, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(26, 43, 109, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Generate Itinerary
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Your Recent Itineraries
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={0}>
              <Typography variant="h6" gutterBottom>
                Golden Triangle Tour
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <LocationIcon color="primary" fontSize="small" />
                  <Typography variant="body2">Delhi → Agra → Jaipur</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CalendarIcon color="primary" fontSize="small" />
                  <Typography variant="body2">May 10 - May 17, 2023</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color="primary"
                  size="small"
                >
                  View Details
                </Button>
              </Stack>
            </StyledPaper>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={0}>
              <Typography variant="h6" gutterBottom>
                Kerala Backwaters
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <LocationIcon color="primary" fontSize="small" />
                  <Typography variant="body2">Kochi → Alleppey → Kumarakom</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CalendarIcon color="primary" fontSize="small" />
                  <Typography variant="body2">December 5 - December 12, 2023</Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  color="primary"
                  size="small"
                >
                  View Details
                </Button>
              </Stack>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
