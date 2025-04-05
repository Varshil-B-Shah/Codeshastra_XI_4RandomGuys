"use client";
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

export default function ItineraryPage() {
  return (
    <DashboardLayout title="Itinerary Planner">
      <h2 className="text-2xl font-bold mb-6">Plan Your Journey</h2>
      <p className="mb-6">Create detailed travel plans</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Upcoming Trip: Golden Triangle</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="font-bold">Day 1 - Delhi</p>
            <p className="text-gray-600">Red Fort, Qutub Minar, Humayun's Tomb</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="font-bold">Day 3 - Agra</p>
            <p className="text-gray-600">Taj Mahal, Agra Fort, Fatehpur Sikri</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-bold">Day 5 - Jaipur</p>
            <p className="text-gray-600">Amber Fort, City Palace, Hawa Mahal</p>
          </div>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Edit Itinerary</button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <button className="flex-1 bg-indigo-600 text-white p-4 rounded-lg shadow hover:bg-indigo-700 transition-colors">
          Create New Itinerary
        </button>
        <button className="flex-1 bg-purple-600 text-white p-4 rounded-lg shadow hover:bg-purple-700 transition-colors">
          Browse Templates
        </button>
      </div>
    </DashboardLayout>
  );
}
