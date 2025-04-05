"use client";
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ScrapbookPage() {
  return (
    <DashboardLayout title="Scrap Book">
      <h2 className="text-2xl font-bold mb-6">Your Travel Memories</h2>
      <p className="mb-6">Save and organize your travel experiences</p>

      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Album
          </button>
          <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            Upload Photos
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Sort by:</span>
          <select className="border border-gray-300 rounded p-1 text-sm">
            <option>Recent</option>
            <option>Oldest</option>
            <option>A-Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { name: 'Kerala Backwaters', date: 'June 2023', count: 45, cover: 'https://source.unsplash.com/random/600x400/?kerala,backwaters' },
          { name: 'Rajasthan Trip', date: 'March 2023', count: 78, cover: 'https://source.unsplash.com/random/600x400/?rajasthan,palace' },
          { name: 'Himachal Trekking', date: 'October 2022', count: 124, cover: 'https://source.unsplash.com/random/600x400/?himachal,mountains' },
          { name: 'Goa Beach Vacation', date: 'December 2022', count: 56, cover: 'https://source.unsplash.com/random/600x400/?goa,beach' },
          { name: 'Andaman Islands', date: 'January 2022', count: 92, cover: 'https://source.unsplash.com/random/600x400/?andaman,beach' },
          { name: 'Delhi & Agra', date: 'November 2021', count: 63, cover: 'https://source.unsplash.com/random/600x400/?tajmahal,delhi' },
        ].map((album, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
            <div className="relative">
              <img src={album.cover} alt={album.name} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white text-gray-800 p-2 rounded-full mx-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
                <button className="bg-white text-gray-800 p-2 rounded-full mx-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{album.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-600 text-sm">{album.date}</span>
                <span className="text-gray-500 text-sm">{album.count} photos</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Recently Added Photos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="relative group">
              <img 
                src={`https://source.unsplash.com/random/300x300/?travel,india&sig=${index}`} 
                alt={`Travel memory ${index}`}
                className="w-full h-24 object-cover rounded-lg shadow-sm"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button className="text-blue-600 hover:underline">View All Photos</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
