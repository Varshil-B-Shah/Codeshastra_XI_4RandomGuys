import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Link, 
  Grid, 
  Chip, 
  Paper, 
  Stack, 
  Divider 
} from '@mui/material';
import { 
  YouTube as YouTubeIcon, 
  WbSunny, 
  Opacity, 
  Air, 
  Visibility, 
  Thermostat 
} from '@mui/icons-material';

// Component to display YouTube links
export const YouTubeLinks = ({ links }) => {
  // Parse the string array if it's a string
  const parsedLinks = typeof links === 'string' ? JSON.parse(links.replace(/'/g, '"')) : links;
  
  // Extract video IDs from URLs to create thumbnails
  const getVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  return (
    <Card sx={{ 
      my: 2, 
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid rgba(0,0,0,0.05)'
    }}>
      <Box sx={{ p: 1, bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center' }}>
        <YouTubeIcon color="error" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" fontWeight={600}>YouTube Results</Typography>
      </Box>
      <CardContent>
        <Grid container spacing={2}>
          {parsedLinks.map((link, index) => {
            const videoId = getVideoId(link);
            return (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ 
                  borderRadius: 1, 
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                  }
                }}>
                  <Link href={link} target="_blank" rel="noopener" underline="none">
                    <CardMedia
                      component="img"
                      height="140"
                      image={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt="YouTube Thumbnail"
                      sx={{ borderRadius: 1 }}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mt: 1, 
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {link}
                    </Typography>
                  </Link>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Component to display Weather information
export const WeatherInfo = ({ weatherData }) => {
  // Extract relevant information
  const currentWeather = weatherData.current_condition?.[0];
  const location = weatherData.nearest_area?.[0];
  const forecast = weatherData.weather?.[0];
  
  if (!currentWeather || !location) {
    return (
      <Card sx={{ my: 2, borderRadius: 2 }}>
        <CardContent>
          <Typography>Weather information unavailable</Typography>
        </CardContent>
      </Card>
    );
  }
  
  const weatherDesc = currentWeather.weatherDesc[0]?.value || 'Unknown';
  const locationName = `${location.areaName[0]?.value || ''}, ${location.region[0]?.value || ''}`;
  
  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card sx={{ 
      my: 2, 
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid rgba(0,0,0,0.05)'
    }}>
      <Box sx={{ 
        p: 1, 
        bgcolor: '#e1f5fe', 
        display: 'flex', 
        alignItems: 'center'
      }}>
        <WbSunny color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" fontWeight={600}>Weather Information</Typography>
      </Box>
      
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5">{locationName}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {currentWeather.localObsDateTime}
              </Typography>
            </Box>
            <Chip 
              label={weatherDesc} 
              color="primary" 
              variant="outlined"
              size="small"
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h3" fontWeight={600} sx={{ mr: 2 }}>
              {currentWeather.temp_C}°C
            </Typography>
            <Stack>
              <Typography variant="body2">
                Feels like: {currentWeather.FeelsLikeC}°C
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentWeather.temp_F}°F / Feels like: {currentWeather.FeelsLikeF}°F
              </Typography>
            </Stack>
          </Box>
          
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
                <Stack alignItems="center" spacing={0.5}>
                  <Opacity fontSize="small" color="info" />
                  <Typography variant="body2">Humidity</Typography>
                  <Typography variant="subtitle2">{currentWeather.humidity}%</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
                <Stack alignItems="center" spacing={0.5}>
                  <Air fontSize="small" color="info" />
                  <Typography variant="body2">Wind</Typography>
                  <Typography variant="subtitle2">{currentWeather.windspeedKmph} km/h</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
                <Stack alignItems="center" spacing={0.5}>
                  <Visibility fontSize="small" color="info" />
                  <Typography variant="body2">Visibility</Typography>
                  <Typography variant="subtitle2">{currentWeather.visibility} km</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
                <Stack alignItems="center" spacing={0.5}>
                  <Thermostat fontSize="small" color="info" />
                  <Typography variant="body2">Pressure</Typography>
                  <Typography variant="subtitle2">{currentWeather.pressure} mb</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          
          {forecast && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Daily Forecast: {formatDate(forecast.date)}
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Min: {forecast.mintempC}°C ({forecast.mintempF}°F)</Typography>
                  <Typography>Max: {forecast.maxtempC}°C ({forecast.maxtempF}°F)</Typography>
                </Stack>
                <Box sx={{ mt: 1 }}>
                  <Chip 
                    size="small" 
                    label={`Sunrise: ${forecast.astronomy[0]?.sunrise}`} 
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip 
                    size="small" 
                    label={`Sunset: ${forecast.astronomy[0]?.sunset}`}
                    sx={{ mb: 1 }}
                  />
                </Box>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Handler for @ai mentions
export const handleAIMention = async (text) => {
  try {
    const response = await fetch('https://a8d1-103-207-59-158.ngrok-free.app/askai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling AI API:', error);
    return { message: "Error processing request" };
  }
};

// Function to check if a message mentions @ai
export const containsAIMention = (message) => {
  return message.toLowerCase().includes('@ai');
};
