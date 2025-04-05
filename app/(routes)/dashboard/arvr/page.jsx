"use client";
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ArVrPage() {
  return (
    <DashboardLayout title="AR/VR Touring">
      <h2 className="text-2xl font-bold mb-6">Virtual Experiences</h2>
      <p className="mb-8">Explore destinations in AR/VR before you visit</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { name: 'Taj Mahal', location: 'Agra', image: 'https://source.unsplash.com/random/300x200/?tajmahal', type: 'VR Tour' },
          { name: 'Jaipur City Palace', location: 'Jaipur', image: 'https://source.unsplash.com/random/300x200/?jaipur,palace', type: 'AR Experience' },
          { name: 'Varanasi Ghats', location: 'Varanasi', image: 'https://source.unsplash.com/random/300x200/?varanasi,ghats', type: 'VR Tour' },
          { name: 'Hampi Ruins', location: 'Karnataka', image: 'https://source.unsplash.com/random/300x200/?hampi,ruins', type: 'AR Experience' },
          { name: 'Khajuraho Temples', location: 'Madhya Pradesh', image: 'https://source.unsplash.com/random/300x200/?khajuraho', type: 'VR Tour' },
          { name: 'Gateway of India', location: 'Mumbai', image: 'https://source.unsplash.com/random/300x200/?gateway,india,mumbai', type: 'AR Experience' },
        ].map((place, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
            <div className="relative">
              <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
              <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold ${
                place.type === 'VR Tour' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {place.type}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{place.name}</h3>
              <p className="text-gray-600 mb-3">{place.location}</p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors w-full">
                Start Experience
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-2">How to use AR/VR features</h3>
        <p className="mb-4">Experience India's wonders virtually before you plan your trip!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-indigo-700 mb-2">1. Choose a destination</h4>
            <p className="text-sm text-gray-600">Browse our collection of AR/VR enabled locations across India.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-indigo-700 mb-2">2. Launch experience</h4>
            <p className="text-sm text-gray-600">Click "Start Experience" and allow camera access for AR features.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-indigo-700 mb-2">3. Explore</h4>
            <p className="text-sm text-gray-600">Use your device to look around and interact with the virtual environment.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Required Equipment</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Smartphone (iOS 12+ or Android 8+)
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              VR Headset (recommended)
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Stable internet connection
            </li>
          </ul>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full">
            Check Compatibility
          </button>
        </div>
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Download Our VR App</h3>
          <p className="mb-4">For a better experience, download our dedicated VR app:</p>
          <div className="flex space-x-4 justify-center">
            <button className="bg-black text-white px-6 py-2 rounded-lg flex items-center">
              <span className="mr-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.039 18.119c-.64.387-1.354.25-2.043.125a5.61 5.61 0 01-1.689-.637 5.61 5.61 0 01-1.688.637c-.69.125-1.404.262-2.044-.125-1.785-1.075-4.826-5.047-4.826-9.118 0-3.689 2.014-4.104 3.307-4.104.722 0 1.36.27 1.894.5.428.184.815.375 1.215.375.364 0 .753-.19 1.181-.375.535-.23 1.174-.5 1.897-.5 1.293 0 3.307.415 3.307 4.104 0 4.072-3.041 8.044-4.826 9.118z"></path>
                </svg>
              </span>
              App Store
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center">
              <span className="mr-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                </svg>
              </span>
              Play Store
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
