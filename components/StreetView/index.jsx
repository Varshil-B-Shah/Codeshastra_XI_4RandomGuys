"use client";

import { useEffect, useRef, useState } from "react";

const StreetView = ({ latitude, longitude }) => {
  const streetViewRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error("Google Maps API key is missing in .env.local file");
        }

        // Create a global error handler for Google Maps
        window.gm_authFailure = () => {
          setError(
            "This API project is not authorized. Please ensure you have:\n1. Enabled billing for your Google Cloud project\n2. Enabled the Maps JavaScript API\n3. Properly configured API key restrictions"
          );
          setLoading(false);
        };

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;

        const loadPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () =>
            reject(new Error("Failed to load Google Maps"));
        });

        document.head.appendChild(script);
        await loadPromise;

        await new Promise((resolve) => setTimeout(resolve, 500));

        initializeStreetView();
      } catch (err) {
        const errorMessage = err.message.toLowerCase();
        if (
          errorMessage.includes("not authorized") ||
          errorMessage.includes("unauthorized")
        ) {
          setError(
            "API Authorization Error: Please ensure you have:\n1. Enabled billing for your Google Cloud project\n2. Enabled the Maps JavaScript API\n3. Properly configured API key restrictions"
          );
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const initializeStreetView = () => {
      try {
        const { google } = window;
        if (!google || !google.maps) {
          throw new Error("Google Maps failed to initialize properly");
        }

        const panorama = new google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: { lat: latitude, lng: longitude },
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
          }
        );
      } catch (err) {
        setError(err.message);
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      const script = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (script) {
        script.remove();
      }
      window.gm_authFailure = null;
    };
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center p-4">
          <p className="text-gray-500">Loading Street View...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center p-4 max-w-md">
          <p className="text-gray-500 font-semibold mb-2">
            Unable to load Street View
          </p>
          <p className="text-sm text-gray-400 whitespace-pre-line">{error}</p>
          <a
            href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 text-sm mt-4 block"
          >
            Open Google Cloud Console
          </a>
        </div>
      </div>
    );
  }

  return <div ref={streetViewRef} className="w-full h-[300px] rounded-lg" />;
};

export default StreetView;
