import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { YouTubeLinks, WeatherInfo } from './ChatTools';

// Component to render AI tool responses in chat
const ChatAIResponse = ({ toolData, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (!toolData || !toolData.tool_data) {
    return null;
  }

  const { tool_name, response } = toolData.tool_data;

  switch (tool_name) {
    case 'yt':
      try {
        // Handle the response which might be a string representation of array
        let parsedResponse;
        if (typeof response === 'string') {
          // Remove single quotes and parse
          parsedResponse = JSON.parse(response.replace(/'/g, '"'));
        } else {
          parsedResponse = response;
        }
        return <YouTubeLinks links={parsedResponse} />;
      } catch (error) {
        console.error('Error parsing YouTube links:', error);
        return null;
      }

    case 'weather':
      return <WeatherInfo weatherData={response} />;

    default:
      return null;
  }
};

export default ChatAIResponse;
