"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaCompass, FaMapMarkedAlt, FaUsers, FaCalculator, FaVrCardboard, FaHashtag, FaBook, FaClipboardList, FaPlus, FaHistory, FaCalendarAlt, FaLock, FaTrophy } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const DashboardSidebar = () => {
  const pathname = usePathname();
  const currentRoute = pathname.split('/').pop();
  
  const menuItems = [
    { name: 'dashboard', displayName: 'Dashboard', icon: <MdDashboard className="text-xl" />, path: '/dashboard' },
    { name: 'explore', displayName: 'Explore', icon: <FaCompass className="text-xl" />, path: '/dashboard/explore' },
    { name: 'itinerary', displayName: 'Itinerary Planner', icon: <FaMapMarkedAlt className="text-xl" />, path: '/dashboard/itinerary' },
    { name: 'groupchat', displayName: 'Group Chat', icon: <FaUsers className="text-xl" />, path: '/dashboard/groupchat' },
    { name: 'expenses', displayName: 'Expense Tracker', icon: <FaCalculator className="text-xl" />, path: '/dashboard/expenses' },
    { name: 'arvr', displayName: 'AR/VR Touring', icon: <FaVrCardboard className="text-xl" />, path: '/dashboard/arvr' },
    { name: 'social', displayName: 'Social Media', icon: <FaHashtag className="text-xl" />, path: '/dashboard/social' },
    { name: 'scrapbook', displayName: 'Scrap Book', icon: <FaBook className="text-xl" />, path: '/dashboard/scrapbook' },
    { name: 'leaderboard', displayName: 'Leader Board', icon: <FaTrophy className="text-xl" />, path: '/dashboard/leaderboard' },
  ];

  const isActiveRoute = (path) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    return pathname === path;
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-800 to-indigo-900 text-white w-64 fixed left-0 top-0 overflow-y-auto shadow-lg">
      <div className="p-5 text-center border-b border-blue-700">
        <h2 className="text-2xl font-bold text-white">Explore India</h2>
        <p className="text-sm text-blue-200">Your Travel Companion</p>
      </div>
      <nav className="p-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link href={item.path}>
                <div
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${
                    isActiveRoute(item.path)
                      ? 'bg-white text-blue-900 font-semibold shadow-lg' 
                      : 'hover:bg-blue-700 text-white'
                  }`}
                > 
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.displayName}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const DashboardContent = () => {
  const [tripCount, setTripCount] = useState(2); // Track number of trips planned
  const router = useRouter();
  
  const pastTrips = [
    { title: 'Goa Beach Vacation', date: 'Jan 15-20, 2023', image: 'https://thewandertherapy.com/wp-content/uploads/2024/03/4.beaches-goa.jpg' },
  ];
  
  const upcomingTrips = [
    { title: 'Rajasthan Desert Tour', date: 'Apr 25-30, 2024', image: 'https://5.imimg.com/data5/GU/ON/WZ/SELLER-17262927/rajasthan-desert-tour-500x500.png' },
    { title: 'Darjeeling Tea Gardens', date: 'May 15-20, 2024', image: 'https://assets.simplotel.com/simplotel/image/upload/x_0,y_168,w_1788,h_1006,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/mayfair-hotels-resorts/Happy-Valley-Tea-Garden_ysbkgj' },
  ];
  
  const handlePlanTrip = () => {
    if (tripCount < 3) {
      setTripCount(tripCount + 1);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Travel Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Upcoming Trips', count: upcomingTrips.length, color: 'bg-green-100 text-green-800 border-green-200' },
            { title: 'Places Explored', count: 12, color: 'bg-blue-100 text-blue-800 border-blue-200' },
            { title: 'Travel Budget', count: '₹25,000', color: 'bg-purple-100 text-purple-800 border-purple-200' },
            { title: 'Group Chats', count: 3, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            { title: 'Saved Places', count: 24, color: 'bg-pink-100 text-pink-800 border-pink-200' },
            { title: 'Travel Photos', count: 147, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
          ].map((item, index) => (
            <div key={index} className={`p-6 rounded-xl shadow-md border ${item.color} hover:shadow-lg transition-shadow`}>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-3xl font-bold mt-2">{item.count}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Upcoming Trips */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center text-gray-800"><FaCalendarAlt className="mr-2 text-blue-600" /> Upcoming Trips</h2>
          <button 
            onClick={handlePlanTrip}
            className={`flex items-center px-4 py-2 rounded-lg text-white font-medium shadow-sm ${
              tripCount >= 3 ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {tripCount >= 3 ? (
              <>
                <FaLock className="mr-2" /> Upgrade to Plan
              </>
            ) : (
              <>
                <FaPlus className="mr-2" /> Plan a Trip
              </>
            )}
          </button>
        </div>
        
        {tripCount >= 3 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-300 p-4 rounded-lg flex items-center shadow-sm">
            <FaLock className="text-yellow-600 mr-2 text-lg" />
            <p className="text-yellow-800 font-medium">
              You've reached the limit of 3 free trips. Upgrade your account to plan more trips.
            </p>
            <button className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded font-medium shadow-sm">
              Upgrade Now
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingTrips.map((trip, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800">{trip.title}</h3>
                <p className="text-gray-700 font-medium">{trip.date}</p>
                <div className="mt-4 flex justify-between">
                  <Link href="/dashboard/itinerary" className="text-blue-600 hover:text-blue-800 font-medium">View Itinerary</Link>
                  <Link href="/dashboard/groupchat" className="text-blue-600 hover:text-blue-800 font-medium">Group Chat</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Past Trips */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800"><FaHistory className="mr-2 text-indigo-600" /> Past Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastTrips.map((trip, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800">{trip.title}</h3>
                <p className="text-gray-700 font-medium">{trip.date}</p>
                <div className="mt-4 flex justify-between">
                  <Link href="/dashboard/scrapbook" className="text-indigo-600 hover:text-indigo-800 font-medium">View Memories</Link>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Share</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <DashboardSidebar />
      <div className="ml-64 flex-1 p-8 overflow-y-auto">
        <header className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-700 font-medium">
            Explore India - Discover the beauty of incredible India
          </p>
        </header>
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;