"use client";
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import VideoPlayer from '@/components/VideoPlayer';
import { Film, ThumbsUp } from 'lucide-react';

export default function VideosPage() {
  // Video data with the YouTube links you provided
  const featuredVideos = [
    {
      url: "https://www.youtube.com/watch?v=U0ZoqmyGJo8",
      title: "Incredible India | A Visual Journey Through India's Diversity",
      description: "Experience the beauty and diversity of India through this captivating visual journey showcasing its landscapes, culture, and people."
    },
    {
      url: "https://www.youtube.com/watch?v=xhrE4M8J3FU",
      title: "Incredible India - Land of Festivals, Colors, and Rich Cultural Heritage",
      description: "Discover India's vibrant festivals, colorful traditions, and the rich cultural heritage that makes it truly incredible."
    }
  ];
  
  // You can add more video collections as needed
  const exploreVideos = [
    // Additional videos could be added here
  ];

  return (
    <DashboardLayout title="Travel Videos">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center mb-6">
            <Film className="w-6 h-6 mr-2 text-[#1A2B6D]" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Videos</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Explore India's breathtaking destinations, vibrant culture, and unique experiences through carefully curated videos.
          </p>
          
          <VideoPlayer videos={featuredVideos} />
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start mt-6">
            <ThumbsUp className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800">Tourism Video Tips</h3>
              <p className="text-blue-700 text-sm">
                These official Incredible India videos showcase the country's diverse culture, magnificent landscapes, and historical monuments. Take inspiration for your next journey across India!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
