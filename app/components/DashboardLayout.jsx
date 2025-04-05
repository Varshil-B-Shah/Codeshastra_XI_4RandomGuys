"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCompass, FaMapMarkedAlt, FaUsers, FaCalculator, FaVrCardboard, FaHashtag, FaBook } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const DashboardSidebar = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'dashboard', displayName: 'Dashboard', icon: <MdDashboard className="text-xl" />, path: '/dashboard' },
    { name: 'explore', displayName: 'Explore', icon: <FaCompass className="text-xl" />, path: '/dashboard/explore' },
    { name: 'itinerary', displayName: 'Itinerary Planner', icon: <FaMapMarkedAlt className="text-xl" />, path: '/dashboard/itinerary' },
    { name: 'groupchat', displayName: 'Group Chat', icon: <FaUsers className="text-xl" />, path: '/dashboard/groupchat' },
    { name: 'expenses', displayName: 'Expense Tracker', icon: <FaCalculator className="text-xl" />, path: '/dashboard/expenses' },
    { name: 'arvr', displayName: 'AR/VR Touring', icon: <FaVrCardboard className="text-xl" />, path: '/dashboard/arvr' },
    { name: 'social', displayName: 'Social Media', icon: <FaHashtag className="text-xl" />, path: '/dashboard/social' },
    { name: 'scrapbook', displayName: 'Scrap Book', icon: <FaBook className="text-xl" />, path: '/dashboard/scrapbook' },
  ];

  const isActiveRoute = (path) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    return pathname === path;
  };

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
              <Link href={item.path}>
                <div
                  className={`flex items-center w-full p-3 rounded-lg transition-all duration-300 ${
                    isActiveRoute(item.path)
                      ? 'bg-white text-blue-900 font-medium shadow-lg' 
                      : 'hover:bg-blue-800'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.displayName}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <DashboardSidebar />
      <div className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">
            Explore India - Discover the beauty of incredible India
          </p>
        </header>
        <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
