"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaCompass,
  FaMapMarkedAlt,
  FaUsers,
  FaCalculator,
  FaVrCardboard,
  FaHashtag,
  FaBook,
  FaTrophy,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";

const DashboardSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "dashboard",
      displayName: "Dashboard",
      icon: <MdDashboard className="text-xl" />,
      path: "/dashboard",
    },
    {
      name: "explore",
      displayName: "Explore",
      icon: <FaCompass className="text-xl" />,
      path: "/dashboard/explore",
    },
    {
      name: "itinerary",
      displayName: "Itinerary Planner",
      icon: <FaMapMarkedAlt className="text-xl" />,
      path: "/dashboard/itinerary",
    },
    {
      name: "groupchat",
      displayName: "Group Chat",
      icon: <FaUsers className="text-xl" />,
      path: "/dashboard/groupchat",
    },
    {
      name: "expenses",
      displayName: "Expense Tracker",
      icon: <FaCalculator className="text-xl" />,
      path: "/dashboard/expenses",
    },
    {
      name: "arvr",
      displayName: "  AR/VR Touring",
      icon: <FaVrCardboard className="text-xl" />,
      path: "/dashboard/arvr",
    },
    {
      name: "social",
      displayName: "Social Media",
      icon: <FaHashtag className="text-xl" />,
      path: "/dashboard/social",
    },
    {
      name: "scrapbook",
      displayName: "Scrap Book",
      icon: <FaBook className="text-xl" />,
      path: "/dashboard/scrapbook",
    },
    {
      name: "leaderboard",
      displayName: "Leaderboard",
      icon: <FaTrophy className="text-xl" />,
      path: "/dashboard/leaderboard",
    },
  ];

  const isActiveRoute = (path) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    return pathname === path;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#1A2B6D] to-[#3B53AF] text-white w-72 fixed left-0 top-0 overflow-y-auto shadow-lg">
      <div className="py-8 px-6 text-center border-b border-[#4C63B6]/40">
        <h2 className="text-2xl font-bold tracking-tight">Explore India</h2>
        <p className="text-sm text-blue-100 mt-1.5 font-light tracking-wide">
          Your Travel Companion
        </p>
      </div>

      <nav className="p-5">
        <div className="space-y-1.5">
          {menuItems.map((item, index) => (
            <Link
              href={item.path}
              key={item.name}
              className={`flex items-center w-full p-3.5 rounded-xl transition-all duration-300
                ${
                  isActiveRoute(item.path)
                    ? "bg-white text-[#1A2B6D] font-semibold shadow-md transform -translate-x-1"
                    : "text-white/90 hover:bg-[#4C63B6]/50 hover:text-white hover:shadow-sm"
                }`}
            >
              <div
                className={`mr-3.5 ${
                  isActiveRoute(item.path) ? "text-[#1A2B6D]" : "text-blue-200"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[15px] tracking-wide">
                {item.displayName}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 px-3 py-4 bg-[#4C63B6]/20 rounded-lg">
          <p className="text-xs text-blue-100 font-medium mb-3">
            PREMIUM FEATURES
          </p>
          <div className="flex items-center py-2.5 px-2 rounded-md bg-gradient-to-r from-[#FF5722]/90 to-[#F9A31A]/90 text-white">
            <span className="flex-1 text-sm">Upgrade to Pro</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </nav>
    </div>
  );
};

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-['Inter']">
      <DashboardSidebar />
      <div className="ml-72 flex-1 p-8 pt-6 max-w-[1800px]">
        {title != "Group Chats" && (
          <header className="mb-8 bg-white p-7 rounded-2xl shadow-sm border border-[#E2E8F0] transition-all hover:shadow-md">
            <h1 className="text-3xl font-bold text-[#1A202C] font-['Poppins']">
              {title}
            </h1>
            <p className="text-[#4A5568] mt-1.5 text-[15px]">
              Explore India - Discover the beauty of incredible India
            </p>
          </header>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2E8F0] animate-fadeIn dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
