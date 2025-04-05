"use client";

import { useEffect, useRef } from "react";

const StreetView = ({ latitude, longitude }) => {
  const streetViewRef = useRef(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      const { google } = window;
      if (!google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.onload = () => initializeStreetView();
        document.head.appendChild(script);
      } else {
        initializeStreetView();
      }
    };

    const initializeStreetView = () => {
      const { google } = window;
      const panorama = new google.maps.StreetViewPanorama(
        streetViewRef.current,
        {
          position: { lat: latitude, lng: longitude },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        }
      );
    };

    loadGoogleMaps();
  }, [latitude, longitude]);

  return <div ref={streetViewRef} style={{ width: "100%", height: "300px" }} />;
};

export default StreetView;
