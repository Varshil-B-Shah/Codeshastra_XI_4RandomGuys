"use client";
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ItineraryPage() {
  return (
    <DashboardLayout title="Itinerary Planner">
      <h2 className="text-2xl font-bold mb-6 text-[#2D3748]">Plan Your Journey</h2>
      <p className="mb-6 text-[#4A5568]">Create detailed travel plans</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-[#E2E8F0] hover:shadow-lg transition-all animate-fadeIn">
        <h3 className="text-xl font-semibold mb-4 text-[#2D3748]">Upcoming Trip: Golden Triangle</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-[#1A2B6D] pl-4 transform hover:translate-x-2 transition-transform duration-300">
            <p className="font-bold text-[#2D3748]">Day 1 - Delhi</p>
            <p className="text-[#4A5568]">Red Fort, Qutub Minar, Humayun's Tomb</p>
          </div>
          <div className="border-l-4 border-[#009688] pl-4 transform hover:translate-x-2 transition-transform duration-300">
            <p className="font-bold text-[#2D3748]">Day 3 - Agra</p>
            <p className="text-[#4A5568]">Taj Mahal, Agra Fort, Fatehpur Sikri</p>
          </div>
          <div className="border-l-4 border-[#FF5722] pl-4 transform hover:translate-x-2 transition-transform duration-300">
            <p className="font-bold text-[#2D3748]">Day 5 - Jaipur</p>
            <p className="text-[#4A5568]">Amber Fort, City Palace, Hawa Mahal</p>
          </div>
        </div>
        <button className="mt-4 bg-[#1A2B6D] text-white px-4 py-2 rounded hover:bg-[#4C63B6] transition-colors transform hover:scale-105">Edit Itinerary</button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <button className="flex-1 bg-[#009688] text-white p-4 rounded-lg shadow hover:bg-[#00796B] transition-all transform hover:scale-105 duration-300">
          Create New Itinerary
        </button>
        <button className="flex-1 bg-[#9F7AEA] text-white p-4 rounded-lg shadow hover:bg-[#805AD5] transition-all transform hover:scale-105 duration-300">
          Browse Templates
        </button>
      </div>
    </DashboardLayout>
  );
}
