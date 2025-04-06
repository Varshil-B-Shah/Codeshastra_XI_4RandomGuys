"use client";
import { useState } from "react";
import { Play, Maximize, X, ExternalLink } from "lucide-react";

const VideoPlayer = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getVideoIdFromUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleVideoChange = (index) => {
    setActiveVideo(index);
  };

  const currentVideo = videos[activeVideo];
  const videoId = getVideoIdFromUrl(currentVideo.url);

  return (
    <div className="my-8">
      {isFullscreen ? (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex justify-between items-center p-4 bg-black/80">
            <h2 className="text-white text-xl font-bold">{currentVideo.title}</h2>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100">
          <div className="relative aspect-video overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={currentVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute bottom-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            <h3 className="text-xl font-bold mb-2 text-gray-800">{currentVideo.title}</h3>
            <p className="text-gray-600 mb-4">{currentVideo.description}</p>

            <div className="flex justify-between items-center">
              <a
                href={currentVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Watch on YouTube
              </a>
            </div>
          </div>

          {videos.length > 1 && (
            <div className="border-t border-gray-100 p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">More Videos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videos.map((video, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-2 rounded-lg cursor-pointer gap-3 ${
                      activeVideo === index
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                    onClick={() => handleVideoChange(index)}
                  >
                    <div className="relative w-20 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${getVideoIdFromUrl(video.url)}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {video.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
