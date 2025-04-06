"use client";
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  useTheme,
  alpha,
  useMediaQuery,
  Container,
  Dialog,
  IconButton,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Autocomplete,
  Stack,
  CircularProgress,
  Chip,
  Switch,
  FormControlLabel,
  Tooltip,
  Divider,
  Slider,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Rating,
  Checkbox,
  FormControl,
  FormGroup,
  FormLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
  Style as StyleIcon,
  DirectionsCar as TransportIcon,
  Star as LuxuryIcon,
  Accessibility as SpecialIcon,
  AutoAwesome as AIIcon,
  Close as CloseIcon,
  MyLocation as CurrentLocationIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  TrendingUp as TrendingIcon,
  CalendarMonth,
  EventAvailable,
  EventBusy,
  AccessTime,
  CurrencyRupee,
  Hotel,
  DirectionsCar,
  Restaurant,
  LocalActivity,
  BeachAccess,
  Museum,
  Hiking,
  ShoppingBag,
  Nightlife,
  Spa,
  SportsSoccer,
  FlightTakeoff,
  Train,
  DirectionsBus,
  TwoWheeler,
  LocalTaxi,
  AirlineSeatReclineNormal,
  AttachMoney,
  Pets as PetsIcon,
  ChildCare as ChildCareIcon,
  MedicalServices as MedicalIcon,
  Fastfood as FoodIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Favorite as CoupleIcon,
  FamilyRestroom as FamilyIcon,
  Groups as FriendsIcon,
} from '@mui/icons-material';
import dynamic from 'next/dynamic';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { addMonths, differenceInDays } from 'date-fns';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Dynamically import map components to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('../../../components/MapComponent'), {
  ssr: false,
  loading: () => <p>Loading Map...</p>
});

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  backdropFilter: 'blur(12px)',
  background: `linear-gradient(135deg, ${alpha('#FF9933', 0.05)} 0%, ${alpha('#138808', 0.05)} 100%)`,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
  '&:hover': {
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const MapWrapper = styled(Box)(({ theme }) => ({
  height: '400px',
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  marginTop: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    height: '500px',
  },
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  background: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.2),
    transform: 'translateY(-1px)',
  },
  '&.MuiChip-filled': {
    background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
    color: 'white',
  },
  transition: 'all 0.2s ease',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  background: alpha(theme.palette.background.paper, 0.05),
}));

const DateChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  padding: theme.spacing(2, 3),
  height: 'auto',
  '& .MuiChip-label': {
    padding: theme.spacing(0.5, 0),
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
  '&.MuiChip-filled': {
    background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    color: theme.palette.primary.contrastText,
  },
}));

// Step components
const DestinationStep = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFromLocation, setSelectedFromLocation] = useState(null);
  const [selectedToLocation, setSelectedToLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India's center
  const [mapZoom, setMapZoom] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const theme = useTheme();

  const categories = [
    { label: 'Heritage', icon: <LocationIcon /> },
    { label: 'Spiritual', icon: <FavoriteIcon /> },
    { label: 'Popular', icon: <TrendingIcon /> },
  ];

  // Indian destinations with rich descriptions
  const destinations = [
    {
      label: 'Taj Mahal, Agra',
      state: 'Uttar Pradesh',
      coordinates: [27.1751, 78.0421],
      description: 'Symbol of eternal love, this magnificent marble monument is one of the Seven Wonders of the World',
      category: ['Heritage', 'Popular']
    },
    {
      label: 'Varanasi Ghats',
      state: 'Uttar Pradesh',
      coordinates: [25.3176, 83.0061],
      description: 'Ancient spiritual city with sacred ghats along the holy Ganges River',
      category: ['Spiritual', 'Heritage']
    },
    {
      label: 'Jaipur City Palace',
      state: 'Rajasthan',
      coordinates: [26.9255, 75.8236],
      description: 'Magnificent palace complex showcasing Rajasthani and Mughal architecture in the Pink City',
      category: ['Heritage', 'Popular']
    },
    {
      label: 'Goa Beaches',
      state: 'Goa',
      coordinates: [15.2993, 74.1240],
      description: 'Paradise of pristine beaches, vibrant nightlife, and Portuguese heritage',
      category: ['Popular']
    },
    {
      label: 'Golden Temple, Amritsar',
      state: 'Punjab',
      coordinates: [31.6200, 74.8765],
      description: 'Holiest shrine of Sikhism, known for its stunning golden architecture',
      category: ['Spiritual', 'Heritage']
    },
    {
      label: 'Mysore Palace',
      state: 'Karnataka',
      coordinates: [12.3052, 76.6552],
      description: 'Spectacular palace illuminated by thousands of lights, showcasing Indo-Saracenic architecture',
      category: ['Heritage']
    },
    {
      label: 'Ranthambore National Park',
      state: 'Rajasthan',
      coordinates: [26.0173, 76.5026],
      description: 'Famous tiger reserve with ancient ruins and diverse wildlife',
      category: ['Popular']
    },
    {
      label: 'Khajuraho Temples',
      state: 'Madhya Pradesh',
      coordinates: [24.8318, 79.9199],
      description: 'UNESCO site known for exquisite temple architecture and sculptures',
      category: ['Heritage', 'Spiritual']
    },
    {
      label: 'Ladakh',
      state: 'Ladakh',
      coordinates: [34.2268, 77.5619],
      description: 'High-altitude desert with Buddhist monasteries and stunning landscapes',
      category: ['Spiritual', 'Popular']
    },
    {
      label: 'Kerala Backwaters',
      state: 'Kerala',
      coordinates: [9.4981, 76.3388],
      description: 'Serene network of lagoons, lakes, and canals parallel to the Arabian Sea coast',
      category: ['Popular']
    }
  ];

  const filteredDestinations = selectedCategory
    ? destinations.filter(dest => dest.category.includes(selectedCategory))
    : destinations;

  const handleFromLocationSelect = (location) => {
    setSelectedFromLocation(location);
    if (location) {
      setMapCenter(location.coordinates);
      setMapZoom(12);
    }
  };

  const handleToLocationSelect = (location) => {
    setSelectedToLocation(location);
    if (location) {
      setMapCenter(location.coordinates);
      setMapZoom(12);
    }
  };

  const handleCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setMapCenter(coords);
          setMapZoom(12);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        }
      );
    }
  };

  return (
    <Stack spacing={4}>
      <HeaderContainer>
        <Stack direction="row" spacing={3} alignItems="center">
          <LocationIcon 
            sx={{ 
              fontSize: { xs: 36, sm: 40, md: 48 }, 
              color: '#FF9933',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              fontWeight={600}
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.5px'
              }}
            >
              Discover Incredible India
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: '600px'
              }}
            >
              Explore the diverse beauty and rich heritage of India
            </Typography>
          </Box>
        </Stack>
      </HeaderContainer>

      <StyledPaper elevation={0}>
        <SearchContainer>
          <Stack spacing={2}>
            <Autocomplete
              options={filteredDestinations}
              getOptionLabel={(option) => option.label}
              fullWidth
              value={selectedFromLocation}
              onChange={(_, newValue) => handleFromLocationSelect(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="From"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <SearchIcon sx={{ color: '#FF9933', mr: 1 }} />,
                    sx: {
                      borderRadius: 2,
                      '& fieldset': {
                        borderWidth: '1.5px',
                      },
                      '&:hover fieldset': {
                        borderWidth: '2px',
                      },
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box 
                  component="li" 
                  {...props} 
                  sx={{ 
                    p: 2,
                    '&:hover': {
                      backgroundColor: alpha('#FF9933', 0.1),
                    }
                  }}
                >
                  <LocationIcon sx={{ mr: 2, color: '#FF9933' }} />
                  <Box>
                    <Typography fontWeight={500}>{option.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.state}
                    </Typography>
                  </Box>
                </Box>
              )}
            />

            <Stack direction="row" spacing={2}>
              <Autocomplete
                options={filteredDestinations}
                getOptionLabel={(option) => option.label}
                fullWidth
                value={selectedToLocation}
                onChange={(_, newValue) => handleToLocationSelect(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="To"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: <SearchIcon sx={{ color: '#FF9933', mr: 1 }} />,
                      sx: {
                        borderRadius: 2,
                        '& fieldset': {
                          borderWidth: '1.5px',
                        },
                        '&:hover fieldset': {
                          borderWidth: '2px',
                        },
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box 
                    component="li" 
                    {...props} 
                    sx={{ 
                      p: 2,
                      '&:hover': {
                        backgroundColor: alpha('#FF9933', 0.1),
                      }
                    }}
                  >
                    <LocationIcon sx={{ mr: 2, color: '#FF9933' }} />
                    <Box>
                      <Typography fontWeight={500}>{option.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.state}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />

              <IconButton
                color="primary"
                onClick={handleCurrentLocation}
                disabled={loading}
                sx={{
                  background: alpha('#FF9933', 0.1),
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  '&:hover': {
                    background: alpha('#FF9933', 0.2),
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <CurrentLocationIcon />
                )}
              </IconButton>
            </Stack>

            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1,
                py: 1
              }}
            >
              {categories.map((category) => (
                <CategoryChip
                  key={category.label}
                  label={category.label}
                  icon={category.icon}
                  onClick={() => setSelectedCategory(selectedCategory === category.label ? null : category.label)}
                  variant={selectedCategory === category.label ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Stack>
        </SearchContainer>

        <MapWrapper>
          <MapWithNoSSR 
            center={mapCenter} 
            zoom={mapZoom} 
            locations={filteredDestinations}
            selectedFrom={selectedFromLocation}
            selectedTo={selectedToLocation}
            onMarkerClick={handleFromLocationSelect}
          />
        </MapWrapper>
      </StyledPaper>
    </Stack>
  );
};

const DateStep = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFlexible, setIsFlexible] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const theme = useTheme();

  const seasons = [
    { label: 'Spring', value: 'spring', icon: <EventAvailable /> },
    { label: 'Summer', value: 'summer', icon: <EventAvailable /> },
    { label: 'Fall', value: 'fall', icon: <EventAvailable /> },
    { label: 'Winter', value: 'winter', icon: <EventAvailable /> },
  ];

  const quickDates = [
    { label: 'Next Month', value: addMonths(new Date(), 1) },
    { label: '3 Months', value: addMonths(new Date(), 3) },
    { label: '6 Months', value: addMonths(new Date(), 6) },
  ];

  const calculateDuration = () => {
    if (startDate && endDate) {
      return differenceInDays(endDate, startDate);
    }
    return 0;
  };

  const handleQuickDateSelect = (date) => {
    setStartDate(date);
    setEndDate(addMonths(date, 1));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack spacing={4}>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <CalendarMonth sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  When would you like to travel?
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Select your travel dates or let us suggest the best time
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isFlexible}
                  onChange={(e) => setIsFlexible(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  I'm flexible with dates
                </Typography>
              }
            />
          </Box>

          <Divider sx={{ opacity: 0.6 }} />

          {!isFlexible ? (
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Quick Select
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mt: 2,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  {quickDates.map((date) => (
                    <Tooltip key={date.label} title={`Travel ${date.label}`}>
                      <DateChip
                        icon={<AccessTime />}
                        label={date.label}
                        onClick={() => handleQuickDateSelect(date.value)}
                        variant={startDate === date.value ? 'filled' : 'outlined'}
                      />
                    </Tooltip>
                  ))}
                </Stack>
              </Box>

              <Stack spacing={3}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  disablePast
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    },
                  }}
                  slots={{
                    openPickerIcon: EventAvailable,
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  disablePast
                  minDate={startDate || undefined}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-root': {
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    },
                  }}
                  slots={{
                    openPickerIcon: EventBusy,
                  }}
                />
              </Stack>

              {startDate && endDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontWeight: 500,
                      }}
                    >
                      <AccessTime />
                      Trip duration: {calculateDuration()} days
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Preferred Season
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                  gap: { xs: 1, sm: 2 },
                }}
              >
                {seasons.map((season) => (
                  <DateChip
                    key={season.value}
                    icon={season.icon}
                    label={season.label}
                    onClick={() => setSelectedSeason(season.value)}
                    variant={selectedSeason === season.value ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </motion.div>
    </LocalizationProvider>
  );
};

const GroupStep = () => {
  const [groupType, setGroupType] = useState('solo');
  const [memberCount, setMemberCount] = useState(1);
  const theme = useTheme();

  const groupTypes = [
    { value: 'solo', label: 'Solo', icon: <GroupIcon /> },
    { value: 'couple', label: 'Couple', icon: <CoupleIcon /> },
    { value: 'family', label: 'Family', icon: <FamilyIcon /> },
    { value: 'friends', label: 'Friends', icon: <FriendsIcon /> },
  ];

  const GroupOption = styled(Button)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: 12,
    textTransform: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    background: 'rgba(37, 99, 235, 0.1)',
    '&:hover': {
      background: 'rgba(37, 99, 235, 0.2)',
    },
    '&.Mui-selected': {
      background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
      color: 'white',
      '& .MuiSvgIcon-root': {
        color: 'white',
      },
    },
  }));

  return (
    <Stack spacing={4}>
      <HeaderContainer>
        <Stack direction="row" spacing={3} alignItems="center">
          <GroupIcon 
            sx={{ 
              fontSize: { xs: 36, sm: 40, md: 48 }, 
              color: '#FF9933',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              fontWeight={600}
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.5px'
              }}
            >
              Who's traveling?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: '600px'
              }}
            >
              Select your travel group type and number of travelers
            </Typography>
          </Box>
        </Stack>
      </HeaderContainer>

      <StyledPaper elevation={0}>
        <Stack spacing={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Group Type</FormLabel>
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                mt: 2,
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                gap: { xs: 2 }
              }}
            >
              {groupTypes.map((type) => (
                <motion.div
                  key={type.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ flex: '1 1 auto' }}
                >
                  <GroupOption
                    fullWidth
                    onClick={() => setGroupType(type.value)}
                    className={groupType === type.value ? 'Mui-selected' : ''}
                  >
                    {type.icon}
                    <Typography variant="body2">{type.label}</Typography>
                  </GroupOption>
                </motion.div>
              ))}
            </Stack>
          </FormControl>

          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={500}>Number of Travelers</Typography>
            <TextField
              type="number"
              value={memberCount}
              onChange={(e) => setMemberCount(Number(e.target.value))}
              InputProps={{ 
                inputProps: { min: 1, max: 20 },
                sx: {
                  borderRadius: 2,
                  '& fieldset': {
                    borderWidth: '1.5px',
                  },
                  '&:hover fieldset': {
                    borderWidth: '2px',
                  },
                }
              }}
              fullWidth
            />
          </Stack>

          {groupType === 'family' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={2}>
                <Typography variant="subtitle1" fontWeight={500}>Family Composition</Typography>
                <TextField
                  label="Number of Adults"
                  type="number"
                  InputProps={{ 
                    inputProps: { min: 1, max: 10 },
                    sx: {
                      borderRadius: 2,
                      '& fieldset': {
                        borderWidth: '1.5px',
                      },
                      '&:hover fieldset': {
                        borderWidth: '2px',
                      },
                    }
                  }}
                  fullWidth
                />
                <TextField
                  label="Number of Children"
                  type="number"
                  InputProps={{ 
                    inputProps: { min: 0, max: 10 },
                    sx: {
                      borderRadius: 2,
                      '& fieldset': {
                        borderWidth: '1.5px',
                      },
                      '&:hover fieldset': {
                        borderWidth: '2px',
                      },
                    }
                  }}
                  fullWidth
                />
                <TextField
                  label="Children Ages (comma separated)"
                  placeholder="e.g., 5, 8, 12"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      '& fieldset': {
                        borderWidth: '1.5px',
                      },
                      '&:hover fieldset': {
                        borderWidth: '2px',
                      },
                    }
                  }}
                  fullWidth
                />
              </Stack>
            </motion.div>
          )}
        </Stack>
      </StyledPaper>
    </Stack>
  );
};

const BudgetStep = () => {
  const [totalBudget, setTotalBudget] = useState(25000);
  const [selectedRange, setSelectedRange] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState({
    Accommodation: 10000,
    Transportation: 8000,
    'Food & Dining': 4000,
    Activities: 3000,
  });
  const theme = useTheme();

  const budgetCategories = [
    {
      icon: <Hotel sx={{ fontSize: 32 }} />,
      title: 'Accommodation',
      min: 1000,
      max: 50000,
      step: 1000,
    },
    {
      icon: <DirectionsCar sx={{ fontSize: 32 }} />,
      title: 'Transportation',
      min: 1000,
      max: 30000,
      step: 1000,
    },
    {
      icon: <Restaurant sx={{ fontSize: 32 }} />,
      title: 'Food & Dining',
      min: 500,
      max: 10000,
      step: 500,
    },
    {
      icon: <LocalActivity sx={{ fontSize: 32 }} />,
      title: 'Activities',
      min: 500,
      max: 15000,
      step: 500,
    },
  ];

  const budgetRanges = [
    { label: 'Budget', range: '₹10,000 - ₹25,000', color: '#4CAF50' },
    { label: 'Mid-Range', range: '₹25,000 - ₹50,000', color: '#FF9933' },
    { label: 'Luxury', range: '₹50,000+', color: '#9C27B0' },
  ];

  const handleCategoryBudgetChange = (category, value) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Stack spacing={4}>
      <HeaderContainer>
        <Stack spacing={1}>
          <Typography 
            variant="h4" 
            fontWeight={600}
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
              letterSpacing: '-0.5px',
              color: theme.palette.text.primary,
            }}
          >
            Budget Planning
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              maxWidth: '600px'
            }}
          >
            Set your budget preferences for different aspects of your trip
          </Typography>
        </Stack>
      </HeaderContainer>

      <StyledPaper elevation={0}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Total Budget Range
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              {budgetRanges.map((range) => (
                <motion.div
                  key={range.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={`${range.label} (${range.range})`}
                    onClick={() => setSelectedRange(range.label)}
                    sx={{
                      bgcolor: selectedRange === range.label ? range.color : 'transparent',
                      color: selectedRange === range.label ? 'white' : 'text.primary',
                      border: `1px solid ${range.color}`,
                      '&:hover': {
                        bgcolor: alpha(range.color, 0.2),
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
            <Box sx={{ px: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <CurrencyRupee />
                <TextField
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  type="number"
                  size="small"
                  inputProps={{ min: 10000, max: 200000, step: 1000 }}
                  sx={{ width: 150 }}
                />
              </Stack>
              <Slider
                value={totalBudget}
                onChange={(_, value) => setTotalBudget(value)}
                min={10000}
                max={200000}
                step={1000}
                valueLabelDisplay="auto"
                valueLabelFormat={formatCurrency}
                marks={[
                  { value: 10000, label: '₹10K' },
                  { value: 50000, label: '₹50K' },
                  { value: 100000, label: '₹1L' },
                  { value: 200000, label: '₹2L' },
                ]}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Budget Breakdown
            </Typography>
            <Grid container spacing={3}>
              {budgetCategories.map((category) => (
                <Grid item xs={12} sm={6} key={category.title}>
                  <Card sx={{
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                    },
                  }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {category.icon}
                          <Typography variant="subtitle1" fontWeight={500}>
                            {category.title}
                          </Typography>
                        </Stack>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              Amount
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {formatCurrency(categoryBudgets[category.title])}
                            </Typography>
                          </Stack>
                          <Slider
                            value={categoryBudgets[category.title]}
                            onChange={(_, value) => handleCategoryBudgetChange(category.title, value)}
                            min={category.min}
                            max={category.max}
                            step={category.step}
                            valueLabelDisplay="auto"
                            valueLabelFormat={formatCurrency}
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </StyledPaper>
    </Stack>
  );
};

const StyleStep = () => {
  const [selectedStyles, setSelectedStyles] = useState([]);
  const theme = useTheme();

  const travelStyles = [
    { id: 'beach', label: 'Beach & Relaxation', icon: <BeachAccess /> },
    { id: 'culture', label: 'Culture & History', icon: <Museum /> },
    { id: 'food', label: 'Food & Dining', icon: <Restaurant /> },
    { id: 'adventure', label: 'Adventure & Sports', icon: <Hiking /> },
    { id: 'shopping', label: 'Shopping', icon: <ShoppingBag /> },
    { id: 'nightlife', label: 'Nightlife', icon: <Nightlife /> },
    { id: 'wellness', label: 'Wellness & Spa', icon: <Spa /> },
    { id: 'sports', label: 'Sports Events', icon: <SportsSoccer /> },
  ];

  const handleStyleClick = (styleId) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  const StyleChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    '&.MuiChip-root': {
      borderRadius: 20,
      padding: theme.spacing(1),
      height: 'auto',
    },
    '&.MuiChip-clickable:hover': {
      background: 'rgba(37, 99, 235, 0.1)',
    },
    '&.MuiChip-filled': {
      background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
      color: 'white',
    },
  }));

  return (
    <Stack spacing={4}>
      <HeaderContainer>
        <Stack direction="row" spacing={3} alignItems="center">
          <StyleIcon 
            sx={{ 
              fontSize: { xs: 36, sm: 40, md: 48 }, 
              color: '#FF9933',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              fontWeight={600}
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.5px'
              }}
            >
              What's your travel style?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: '600px'
              }}
            >
              Select your preferred travel activities and interests
            </Typography>
          </Box>
        </Stack>
      </HeaderContainer>

      <StyledPaper elevation={0}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {travelStyles.map((style) => (
              <motion.div
                key={style.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <StyleChip
                  icon={style.icon}
                  label={style.label}
                  onClick={() => handleStyleClick(style.id)}
                  variant={selectedStyles.includes(style.id) ? 'filled' : 'outlined'}
                  color="primary"
                />
              </motion.div>
            ))}
          </Box>

          {selectedStyles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={2}>
                <Typography variant="subtitle1" color="primary" fontWeight={600}>
                  Selected Interests
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedStyles.map((styleId) => {
                    const style = travelStyles.find((s) => s.id === styleId);
                    return (
                      <StyleChip
                        key={styleId}
                        icon={style?.icon}
                        label={style?.label}
                        onDelete={() => handleStyleClick(styleId)}
                        variant="filled"
                        color="primary"
                      />
                    );
                  })}
                </Box>
              </Stack>
            </motion.div>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Popular Combinations
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                  onClick={() => setSelectedStyles(['culture', 'food'])}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Museum fontSize="small" color="primary" />
                    <Restaurant fontSize="small" color="primary" />
                    <Typography variant="body2">Cultural Foodie</Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                  onClick={() => setSelectedStyles(['beach', 'wellness'])}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BeachAccess fontSize="small" color="primary" />
                    <Spa fontSize="small" color="primary" />
                    <Typography variant="body2">Beach Relaxation</Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                  onClick={() => setSelectedStyles(['adventure', 'sports'])}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Hiking fontSize="small" color="primary" />
                    <SportsSoccer fontSize="small" color="primary" />
                    <Typography variant="body2">Adventure Sports</Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                  onClick={() => setSelectedStyles(['shopping', 'nightlife'])}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ShoppingBag fontSize="small" color="primary" />
                    <Nightlife fontSize="small" color="primary" />
                    <Typography variant="body2">Urban Explorer</Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </StyledPaper>
    </Stack>
  );
};

const LuxuryStep = () => {
  const [luxuryLevel, setLuxuryLevel] = useState(3);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const theme = useTheme();

  const LuxuryChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    '&.MuiChip-root': {
      borderRadius: 20,
      padding: theme.spacing(1),
      height: 'auto',
    },
    '&.MuiChip-clickable:hover': {
      background: 'rgba(37, 99, 235, 0.1)',
    },
    '&.MuiChip-filled': {
      background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
      color: 'white',
    },
  }));

  const luxuryPreferences = [
    { id: 'hotel', label: 'Luxury Hotels', icon: <Hotel /> },
    { id: 'dining', label: 'Fine Dining', icon: <Restaurant /> },
    { id: 'transport', label: 'Private Transport', icon: <DirectionsCar /> },
    { id: 'spa', label: 'Spa Services', icon: <Spa /> },
  ];

  const handlePreferenceClick = (preferenceId) => {
    setSelectedPreferences((prev) =>
      prev.includes(preferenceId)
        ? prev.filter((id) => id !== preferenceId)
        : [...prev, preferenceId]
    );
  };

  return (
    <Stack spacing={4}>
      <HeaderContainer>
        <Stack direction="row" spacing={3} alignItems="center">
          <LuxuryIcon 
            sx={{ 
              fontSize: { xs: 36, sm: 40, md: 48 }, 
              color: '#FF9933',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              fontWeight={600}
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.5px'
              }}
            >
              What's your luxury preference?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: '600px'
              }}
            >
              Select your desired level of luxury and specific preferences
            </Typography>
          </Box>
        </Stack>
      </HeaderContainer>

      <StyledPaper elevation={0}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Luxury Level
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2">Budget</Typography>
              <Slider
                value={luxuryLevel}
                onChange={(_, value) => setLuxuryLevel(value)}
                min={1}
                max={5}
                step={1}
                marks
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} Star`}
              />
              <Typography variant="body2">Luxury</Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Luxury Preferences
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {luxuryPreferences.map((preference) => (
                <motion.div
                  key={preference.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LuxuryChip
                    icon={preference.icon}
                    label={preference.label}
                    onClick={() => handlePreferenceClick(preference.id)}
                    variant={selectedPreferences.includes(preference.id) ? 'filled' : 'outlined'}
                    color="primary"
                  />
                </motion.div>
              ))}
            </Box>
          </Box>

          {selectedPreferences.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Stack spacing={2}>
                <Typography variant="subtitle1" color="primary" fontWeight={600}>
                  Selected Preferences
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedPreferences.map((preferenceId) => {
                    const preference = luxuryPreferences.find((p) => p.id === preferenceId);
                    return (
                      <LuxuryChip
                        key={preferenceId}
                        icon={preference?.icon}
                        label={preference?.label}
                        onDelete={() => handlePreferenceClick(preferenceId)}
                        variant="filled"
                        color="primary"
                      />
                    );
                  })}
                </Box>
              </Stack>
            </motion.div>
          )}
        </Stack>
      </StyledPaper>
    </Stack>
  );
};

const SpecialStep = () => {
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const theme = useTheme();

  const SpecialStyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 12,
    backdropFilter: 'blur(8px)',
    background: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  }));

  const specialConditions = [
    {
      id: 'accessibility',
      label: 'Accessibility Requirements',
      icon: <SpecialIcon />,
      description: 'Wheelchair access, elevators, etc.',
    },
    {
      id: 'pets',
      label: 'Traveling with Pets',
      icon: <PetsIcon />,
      description: 'Pet-friendly accommodations and transport',
    },
    {
      id: 'children',
      label: 'Traveling with Children',
      icon: <ChildCareIcon />,
      description: 'Child-friendly facilities and activities',
    },
    {
      id: 'medical',
      label: 'Medical Requirements',
      icon: <MedicalIcon />,
      description: 'Special medical needs or equipment',
    },
    {
      id: 'dietary',
      label: 'Dietary Restrictions',
      icon: <FoodIcon />,
      description: 'Special dietary needs or allergies',
    },
  ];

  const handleConditionChange = (conditionId) => {
    setSelectedConditions((prev) =>
      prev.includes(conditionId)
        ? prev.filter((id) => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  return (
    <Stack spacing={4}>
      <HeaderContainer>
        <Stack direction="row" spacing={3} alignItems="center">
          <SpecialIcon 
            sx={{ 
              fontSize: { xs: 36, sm: 40, md: 48 }, 
              color: '#FF9933',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              fontWeight={600}
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.5px'
              }}
            >
              Any special requirements?
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: '600px'
              }}
            >
              Let us know about any special conditions or requirements for your trip
            </Typography>
          </Box>
        </Stack>
      </HeaderContainer>

      <StyledPaper elevation={0}>
        <Stack spacing={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Special Conditions</FormLabel>
            <FormGroup>
              {specialConditions.map((condition) => (
                <motion.div
                  key={condition.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedConditions.includes(condition.id)}
                        onChange={() => handleConditionChange(condition.id)}
                        color="primary"
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        {condition.icon}
                        <Box>
                          <Typography variant="body1">{condition.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {condition.description}
                          </Typography>
                        </Box>
                      </Stack>
                    }
                  />
                </motion.div>
              ))}
            </FormGroup>
          </FormControl>

          {selectedConditions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TextField
                label="Additional Notes"
                multiline
                rows={4}
                fullWidth
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Please provide any additional details about your special requirements..."
              />
            </motion.div>
          )}
        </Stack>
      </StyledPaper>
    </Stack>
  );
};

const AIPromptStep = () => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const theme = useTheme();

  const generatePrompt = () => {
    // This would be replaced with actual AI prompt generation logic
    const mockPrompt = `Plan a detailed travel itinerary for a trip to Paris, France. Include:
- Day-by-day activities and sightseeing
- Restaurant recommendations for each meal
- Transportation options between locations
- Estimated costs for each activity
- Tips for local customs and etiquette
- Weather-appropriate clothing suggestions
- Emergency contact information`;
    setGeneratedPrompt(mockPrompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  const PromptBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: 8,
    background: 'rgba(37, 99, 235, 0.05)',
    border: '1px solid rgba(37, 99, 235, 0.1)',
    position: 'relative',
  }));

  return (
    <Stack spacing={4}>
      <HeaderContainer>
        <Stack direction="row" spacing={3} alignItems="center">
          <AIIcon 
            sx={{ 
              fontSize: { xs: 36, sm: 40, md: 48 }, 
              color: '#FF9933',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              fontWeight={600}
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                letterSpacing: '-0.5px'
              }}
            >
              Generate AI Travel Prompt
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' },
                maxWidth: '600px'
              }}
            >
              Create a custom AI prompt for your travel planning or use our template
            </Typography>
          </Box>
        </Stack>
      </HeaderContainer>

      <StyledPaper elevation={0}>
        <Stack spacing={4}>
          <TextField
            label="Customize Your Prompt"
            multiline
            rows={4}
            fullWidth
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your custom travel planning prompt here..."
            InputProps={{
              endAdornment: (
                <Tooltip title="Generate AI Prompt">
                  <IconButton onClick={generatePrompt} color="primary">
                    <AIIcon />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />

          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PromptBox>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <AIIcon color="primary" />
                  <Typography variant="subtitle1" color="primary">
                    Generated AI Prompt
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Tooltip title="Copy to Clipboard">
                    <IconButton onClick={copyToClipboard} size="small">
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Regenerate">
                    <IconButton onClick={generatePrompt} size="small">
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {generatedPrompt}
                </Typography>
              </PromptBox>
            </motion.div>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={generatePrompt}
            startIcon={<AIIcon />}
            fullWidth
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1A2B6D 0%, #4C63B6 100%)',
              py: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(26, 43, 109, 0.3)'
              }
            }}
          >
            Generate AI Travel Prompt
          </Button>
        </Stack>
      </StyledPaper>
    </Stack>
  );
};

const TravelWizard = ({ handleClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const steps = [
    { label: 'Destination', icon: <LocationIcon />, color: '#00BFA6' },
    { label: 'Dates', icon: <CalendarIcon />, color: '#FF6E40' },
    { label: 'Group', icon: <GroupIcon />, color: '#42A5F5' },
    { label: 'Budget', icon: <MoneyIcon />, color: '#FF8A65' },
    { label: 'Style', icon: <StyleIcon />, color: '#00BFA6' },
    { label: 'Luxury', icon: <LuxuryIcon />, color: '#42A5F5' },
    { label: 'Special', icon: <SpecialIcon />, color: '#FF8A65' },
    { label: 'AI Prompt', icon: <AIIcon />, color: '#00BFA6' },
  ];

  const handleNext = () => {
    setCompletedSteps((prev) => new Set([...prev, activeStep]));
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompletedSteps(new Set());
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: return <DestinationStep />;
      case 1: return <DateStep />;
      case 2: return <GroupStep />;
      case 3: return <BudgetStep />;
      case 4: return <StyleStep />;
      case 5: return <LuxuryStep />;
      case 6: return <SpecialStep />;
      case 7: return <AIPromptStep />;
      default: return null;
    }
  };

  const CustomStepIcon = (props) => {
    const { active, completed, icon } = props;
    const step = steps[Number(icon) - 1];

    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: active ? 1.1 : 1,
          transition: { duration: 0.2 },
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: active
              ? `linear-gradient(135deg, ${step.color} 0%, ${alpha(step.color, 0.7)} 100%)`
              : completed
                ? alpha(step.color, 0.1)
                : alpha(theme.palette.background.paper, 0.5),
            color: active ? 'white' : step.color,
            border: active ? 'none' : `2px solid ${alpha(step.color, 0.2)}`,
            boxShadow: active ? `0 4px 12px ${alpha(step.color, 0.3)}` : 'none',
          }}
        >
          {step.icon}
        </Box>
      </motion.div>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <DialogTitle 
        sx={{ m: 0, p: 2 }}
        component="div"
      >
        <Typography 
          variant="h5" 
          align="center" 
          fontWeight="bold"
          component="h2"
        >
          Travel Planning Wizard
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Container maxWidth="lg">
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mt: 2,
              mb: 4,
              overflowX: 'auto',
              '& .MuiStepLabel-label': { fontWeight: 600 },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label} completed={completedSteps.has(index)}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  {!isMobile && step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 4,
              minHeight: '300px',
              bgcolor: alpha('#fff', 0.9),
              backdropFilter: 'blur(10px)',
              mb: 4
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>
          </Paper>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            position: 'sticky',
            bottom: 0,
            bgcolor: alpha('#fff', 0.9),
            p: 2,
            borderRadius: 2
          }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleReset : handleNext}
              sx={{
                borderRadius: 2,
                px: 3,
                background: 'linear-gradient(135deg, #1A2B6D 0%, #4C63B6 100%)',
              }}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Container>
      </DialogContent>
    </Box>
  );
};

export default function ItineraryPage() {
  const [openWizard, setOpenWizard] = useState(false);
  
  const handleOpenWizard = () => {
    setOpenWizard(true);
  };
  
  const handleCloseWizard = () => {
    setOpenWizard(false);
  };

  return (
    <DashboardLayout title="Itinerary Planner">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#2D3748]">Plan Your Journey</h2>
        <p className="mt-2 text-[#4A5568]">Create detailed travel plans</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-[#E2E8F0] hover:shadow-lg transition-all animate-fadeIn">
        <h3 className="text-xl font-semibold mb-4 text-[#2D3748]">Upcoming Trip: Golden Triangle</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-[#1A2B6D] pl-4 transform hover:translate-x-2 transition-transform duration-300">
            <p className="font-bold text-[#2D3748]">Day 1 - Delhi</p>
            <p className="text-[#4A5568]">Red Fort, Qutub Minar, Humayun's Tomb</p>
          </div>
          <div className="border-l-4 border-[#009688] pl-4 transform hover:translate-x-2 transition-transform duration-300">
            <p className="font-bold text-[#2D3748]">Day 3 - Agra</p>
            <p className="text-[#4A5568]">Taj Mahal, Agra Fort, Fatehpur Sikri</p>
          </div>
          <div className="border-l-4 border-[#FF5722] pl-4 transform hover:translate-x-2 transition-transform duration-300">
            <p className="font-bold text-[#2D3748]">Day 5 - Jaipur</p>
            <p className="text-[#4A5568]">Amber Fort, City Palace, Hawa Mahal</p>
          </div>
        </div>
        <button className="mt-4 bg-[#1A2B6D] text-white px-4 py-2 rounded hover:bg-[#4C63B6] transition-colors transform hover:scale-105">Edit Itinerary</button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <button 
          className="flex-1 bg-[#009688] text-white p-4 rounded-lg shadow hover:bg-[#00796B] transition-all transform hover:scale-105 duration-300"
          onClick={handleOpenWizard}
        >
          Create New Itinerary
        </button>
        <button className="flex-1 bg-[#9F7AEA] text-white p-4 rounded-lg shadow hover:bg-[#805AD5] transition-all transform hover:scale-105 duration-300">
          Browse Templates
        </button>
      </div>

      {/* Travel Wizard Dialog */}
      <Dialog
        fullScreen
        open={openWizard}
        onClose={handleCloseWizard}
        TransitionComponent={Transition}
      >
        <TravelWizard handleClose={handleCloseWizard} />
      </Dialog>
    </DashboardLayout>
  );
}
