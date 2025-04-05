"use client";
import React, { useState } from 'react';
import { FaCompass, FaMapMarkedAlt, FaUsers, FaCalculator, FaVrCardboard, FaHashtag, FaBook, FaClipboardList } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <MdDashboard className="text-xl" /> },
    { name: 'Explore', icon: <FaCompass className="text-xl" /> },
    { name: 'Itinerary Planner', icon: <FaMapMarkedAlt className="text-xl" /> },
    { name: 'Group Chat', icon: <FaUsers className="text-xl" /> },
    { name: 'Expense Tracker', icon: <FaCalculator className="text-xl" /> },
    { name: 'AR/VR Touring', icon: <FaVrCardboard className="text-xl" /> },
    { name: 'Social Media', icon: <FaHashtag className="text-xl" /> },
    { name: 'Scrap Book', icon: <FaBook className="text-xl" /> },
    { name: 'Kanban', icon: <FaClipboardList className="text-xl" /> },
  ];

  return (
    <div className="h-screen bg-gradient-to-b from-blue-900 to-indigo-800 text-white w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 text-center border-b border-blue-700">
        <h2 className="text-xl font-bold">Explore India</h2>
        <p className="text-xs text-blue-300">Your Travel Companion</p>
      </div>
      <nav className="p-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <button
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${
                  activeTab === item.name 
                    ? 'bg-white text-blue-900 font-medium shadow-lg' 
                    : 'hover:bg-blue-800'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const DashboardContent = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Welcome to Your Travel Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Upcoming Trips', count: 2, color: 'bg-green-100 text-green-800' },
                { title: 'Places Explored', count: 12, color: 'bg-blue-100 text-blue-800' },
                { title: 'Travel Budget', count: '₹25,000', color: 'bg-purple-100 text-purple-800' },
                { title: 'Group Chats', count: 3, color: 'bg-yellow-100 text-yellow-800' },
                { title: 'Saved Places', count: 24, color: 'bg-pink-100 text-pink-800' },
                { title: 'Travel Photos', count: 147, color: 'bg-indigo-100 text-indigo-800' }
              ].map((item, index) => (
                <div key={index} className={`p-6 rounded-xl shadow-md ${item.color}`}>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-3xl font-bold mt-2">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Explore':
        return <div><h2 className="text-2xl font-bold mb-6">Explore Amazing Places</h2><p>Discover new destinations across India</p></div>;
      case 'Itinerary Planner':
        return <div><h2 className="text-2xl font-bold mb-6">Plan Your Journey</h2><p>Create detailed travel plans</p></div>;
      case 'Group Chat':
        return <div><h2 className="text-2xl font-bold mb-6">Group Conversations</h2><p>Chat with fellow travelers</p></div>;
      case 'Expense Tracker':
        return <div><h2 className="text-2xl font-bold mb-6">Track Your Expenses</h2><p>Manage your travel budget effectively</p></div>;
      case 'AR/VR Touring':
        return <div><h2 className="text-2xl font-bold mb-6">Virtual Experiences</h2><p>Explore destinations in AR/VR</p></div>;
      case 'Social Media':
        return <div><h2 className="text-2xl font-bold mb-6">Travel Social Network</h2><p>Connect with other travelers</p></div>;
      case 'Scrap Book':
        return <div><h2 className="text-2xl font-bold mb-6">Your Travel Memories</h2><p>Save and organize your travel experiences</p></div>;
      case 'Kanban':
        return <div><h2 className="text-2xl font-bold mb-6">Travel Task Board</h2><p>Organize your travel tasks efficiently</p></div>;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
      {renderContent()}
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {activeTab}
          </h1>
          <p className="text-gray-600">
            Explore India - Discover the beauty of incredible India
          </p>
        </header>
        <DashboardContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Dashboard;