import React from 'react';
import { Card } from './ui/card';
import { Youtube } from 'lucide-react';

export function YouTubeResults({ response }) {
  // Parse the response string (it comes as a string representation of an array)
  let videoLinks = [];
  try {
    const parsed = response.replace(/'/g, '"');
    videoLinks = JSON.parse(parsed);
  } catch (error) {
    // Handle any parsing errors by using regex to extract URLs
    const urlRegex = /https:\/\/www\.youtube\.com\/watch\?v=[^'\s]+/g;
    const matches = response.match(urlRegex);
    if (matches) {
      videoLinks = matches;
    }
  }

  if (!videoLinks || videoLinks.length === 0) {
    return null;
  }

  // Limit to first 2 videos for in-chat display
  const displayLinks = videoLinks.slice(0, 2);

  return (
    <div className="mt-3 w-full">
      <div className="flex items-center mb-2">
        <Youtube className="h-4 w-4 text-red-600 mr-2" />
        <h3 className="font-medium text-sm">YouTube Results</h3>
      </div>
      <div className="grid gap-3">
        {displayLinks.map((link, index) => {
          // Extract video ID from URL
          const videoId = link.split('v=')[1]?.split('&')[0];
          
          return (
            <Card key={index} className="overflow-hidden">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-2">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  Open on YouTube
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
