"use client";
import React, { useState, useCallback, useEffect } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import dynamic from "next/dynamic";
import Carousel from "@/components/Carousel";
import StreetView from "@/components/StreetView";

const landmarks = [
  {
    name: "Taj Mahal",
    location: "Agra",
    image: "/Taj_Mahal.jpeg",
    type: "VR Tour",
    coords: { lat: 27.1731, lng: 78.0421 },
  },
  {
    name: "Red Fort",
    location: "Delhi",
    image: "/red_fort.jpg",
    type: "VR Tour",
    coords: { lat: 28.6562, lng: 77.241 },
  },
  {
    name: "Gateway of India",
    location: "Mumbai",
    image: "/gateway_of_india.jpg",
    type: "VR Tour",
    coords: { lat: 18.9219, lng: 72.8347 },
  },
  {
    name: "Golden Temple",
    location: "Amritsar",
    image: "/golden_temple.jpg",
    type: "VR Tour",
    coords: { lat: 31.62, lng: 74.8765 },
  },
  {
    name: "Ellora Caves",
    location: "Aurangabad",
    image: "/ellora_caves.jpg",
    type: "VR Tour",
    coords: { lat: 20.0268, lng: 75.1779 },
  },
];

export default function ArVrPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentLandmark, setCurrentLandmark] = useState(landmarks[0]);

  const handleItemChange = useCallback((place) => {
    setCurrentLandmark(place);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <div className="relative w-screen h-screen">
        <StreetView
          latitude={currentLandmark.coords.lat}
          longitude={currentLandmark.coords.lng}
          isFullscreen={true}
        />
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <h2 className="text-white text-2xl font-semibold">
            {currentLandmark.name}
          </h2>
          <button
            onClick={() => setIsFullscreen(false)}
            className="bg-black/50 text-white px-6 py-3 rounded-lg hover:bg-black/70 transition-all"
          >
            Exit Experience
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Virtual Touring">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Virtual Experience</h2>
        <p className="text-xl text-gray-900 mb-10">
          Explore destination virtually before you visit
        </p>

        <div className="relative">
          <Carousel
            items={landmarks}
            onItemChange={handleItemChange}
            renderItem={(place) => (
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                <div className="relative">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-6 right-6 px-6 py-3 rounded-full text-base font-bold bg-blue-500 text-white">
                    {place.type}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-4xl font-bold text-white mb-2">
                      {place.name}
                    </h3>
                    <p className="text-xl text-white/90 mb-4">
                      {place.location}
                    </p>
                  </div>
                </div>
                <div className="p-8">
                  <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                    <StreetView
                      latitude={place.coords.lat}
                      longitude={place.coords.lng}
                    />
                  </div>
                  {/* <button
                    onClick={() => setIsFullscreen(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors w-full text-lg font-semibold"
                  >
                    Start Experience
                  </button> */}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
