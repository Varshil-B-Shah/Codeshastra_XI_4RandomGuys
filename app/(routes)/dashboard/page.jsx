"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaCompass,
  FaMapMarkedAlt,
  FaUsers,
  FaCalculator,
  FaVrCardboard,
  FaHashtag,
  FaBook,
  FaClipboardList,
  FaPlus,
  FaHistory,
  FaCalendarAlt,
  FaLock,
  FaTrophy,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import DashboardLayout from "@/app/components/DashboardLayout";

// Dashboard sidebar is now handled by the main DashboardLayout component

const DashboardContent = () => {
  const [tripCount, setTripCount] = useState(2); // Track number of trips planned
  const router = useRouter();

  const pastTrips = [
    {
      title: "Goa Beach Vacation",
      date: "Jan 15-20, 2023",
      image:
        "https://thewandertherapy.com/wp-content/uploads/2024/03/4.beaches-goa.jpg",
    },
  ];

  const upcomingTrips = [
    {
      title: "Rajasthan Desert Tour",
      date: "Apr 25-30, 2024",
      image:
        "https://5.imimg.com/data5/GU/ON/WZ/SELLER-17262927/rajasthan-desert-tour-500x500.png",
    },
    {
      title: "Darjeeling Tea Gardens",
      date: "May 15-20, 2024",
      image:
        "https://assets.simplotel.com/simplotel/image/upload/x_0,y_168,w_1788,h_1006,r_0,c_crop/q_80,w_900,dpr_1,f_auto,fl_progressive,c_limit/mayfair-hotels-resorts/Happy-Valley-Tea-Garden_ysbkgj",
    },
  ];

  const handlePlanTrip = () => {
    if (tripCount < 3) {
      setTripCount(tripCount + 1);
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="items-center justify-center">
        {/* Hero Section */}
        <div className="rounded-2xl overflow-hidden relative mb-12 animate-fadeIn">
          <div className="bg-gradient-to-r from-[#1A2B6D] to-[#1A2B6D]/80 py-9 px-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-no-repeat bg-cover opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white font-['Poppins'] mb-3">
                Welcome back, Explorer!
              </h2>
              <p className="text-blue-100 text-lg mb-6">
                Ready to discover more of India's wonders?
              </p>
              <Link href={"/dashboard/itinerary"}>
              <button className="btn-accent">
                <FaPlus className="mr-2 inline-block" /> Plan your next
                adventure
              </button>
              </Link>
            </div>
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <img
                src="/travel-blob.svg"
                alt="Decoration"
                className="w-64 opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="dashboard-card p-8 mb-8 animate-fadeIn">
          <h3 className="text-2xl font-bold mb-7 text-[#1A202C] font-['Poppins'] flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-3 text-[#1A2B6D]"
            >
              <path d="M12 20V10"></path>
              <path d="M18 20V4"></path>
              <path d="M6 20v-4"></path>
            </svg>
            Your Travel Stats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Upcoming Trips",
                count: upcomingTrips.length,
                color: "bg-[#E6FFFA] text-[#009688] border-[#4FD1C5]",
                icon: "M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12v-2a9 9 0 10-18 0v2m18 0v2a9 9 0 01-18 0v-2m18 0h-2m-16 0H3",
              },
              {
                title: "Places Explored",
                count: 12,
                color: "bg-[#EBF4FF] text-[#1A2B6D] border-[#4C63B6]",
                icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
              },
              {
                title: "Travel Budget",
                count: "₹25,000",
                color: "bg-[#F3E8FF] text-[#9F7AEA] border-[#9F7AEA]",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Group Chats",
                count: 3,
                color: "bg-[#FFFBEB] text-[#FF5722] border-[#FF7E67]",
                icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z",
              },
              {
                title: "Saved Places",
                count: 24,
                color: "bg-[#FEEBEF] text-[#FF7E67] border-[#FF7E67]",
                icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
              },
              {
                title: "Travel Photos",
                count: 147,
                color: "bg-[#EEF2FF] text-[#4C63B6] border-[#4C63B6]",
                icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl shadow-sm border ${
                  item.color
                } transition-all transform hover:-translate-y-1 hover:shadow-md duration-300 staggered-item-${
                  (index % 4) + 1
                } animate-scaleIn`}
              >
                <div className="flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d={item.icon}></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-0.5">{item.title}</h3>
                <p className="text-3xl font-bold">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Trips */}
        <div className="dashboard-card p-8 mb-9 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-bold text-[#1A202C] font-['Poppins'] flex items-center">
              <FaCalendarAlt className="mr-3 text-[#1A2B6D]" />
              Upcoming Trips
            </h3>
            <button
              onClick={
                tripCount >= 3
                  ? () => (window.location.href = "/dashboard/pricing")
                  : handlePlanTrip
              }
              className={`mt-3 sm:mt-0 ${
                tripCount >= 3 ? "bg-gray-500 text-white" : "btn-accent"
              } px-5 py-3 rounded-full flex items-center shadow-sm`}
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
            <div className="mb-7 bg-[#FFFBEB] border border-[#FBBF24]/30 p-4 rounded-xl flex items-center shadow-sm">
              <FaLock className="text-[#D97706] mr-3 text-lg" />
              <p className="text-[#D97706] font-medium flex-1">
                You've reached the limit of 3 free trips. Upgrade your account
                to plan more trips.
              </p>
              <Link href="/dashboard/pricing">
                <button className="ml-4 bg-[#D97706] hover:bg-[#B45309] text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors">
                  Upgrade Now
                </button>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTrips.map((trip, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scaleIn staggered-item-${(index % 4) + 1}`}
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transform transition-transform hover:scale-110 duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block bg-[#E6FFFA] text-[#009688] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Upcoming
                  </span>
                  <h3 className="font-bold text-lg text-[#1A202C] mb-1">
                    {trip.title}
                  </h3>
                  <p className="text-[#4A5568] font-medium text-sm flex items-center">
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
                      className="mr-1.5"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {trip.date}
                  </p>
                  <div className="mt-5 flex justify-between">
                    <Link
                      href="/dashboard/itinerary"
                      className="text-[#1A2B6D] hover:text-[#009688] font-medium transition-colors text-sm flex items-center"
                    >
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
                        className="mr-1.5"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      View Itinerary
                    </Link>
                    <Link
                      href="/dashboard/groupchat"
                      className="text-[#1A2B6D] hover:text-[#009688] font-medium transition-colors text-sm flex items-center"
                    >
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
                        className="mr-1.5"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                      Group Chat
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Trips */}
        <div className="dashboard-card p-8 mb-9 animate-fadeIn">
          <h3 className="text-2xl font-bold mb-7 text-[#1A202C] font-['Poppins'] flex items-center">
            <FaHistory className="mr-3 text-[#9F7AEA]" /> Past Trips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastTrips.map((trip, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-scaleIn"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <span className="inline-block bg-[#F3E8FF] text-[#9F7AEA] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Completed
                  </span>
                  <h3 className="font-bold text-lg text-[#1A202C] mb-1">
                    {trip.title}
                  </h3>
                  <p className="text-[#4A5568] font-medium text-sm flex items-center">
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
                      className="mr-1.5"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {trip.date}
                  </p>
                  <div className="mt-5 flex justify-between">
                    <Link
                      href="/dashboard/scrapbook"
                      className="text-[#9F7AEA] hover:text-[#805AD5] font-medium transition-colors text-sm flex items-center"
                    >
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
                        className="mr-1.5"
                      >
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                      </svg>
                      View Memories
                    </Link>
                    <button className="text-[#9F7AEA] hover:text-[#805AD5] font-medium transition-colors text-sm flex items-center">
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
                        className="mr-1.5"
                      >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16 6 12 2 8 6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-[#F9FAFB] rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center p-8 hover:bg-[#F3F4F6] transition-colors cursor-pointer min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-[#EBF4FF] flex items-center justify-center mb-4">
                <FaPlus className="text-[#1A2B6D] text-xl" />
              </div>
              <h3 className="text-lg font-bold text-[#1A202C]">
                Add Your Trip
              </h3>
              <p className="text-[#4A5568] text-center mt-2">
                Document your past travels
              </p>
              <button className="mt-6 px-6 py-2 bg-white text-[#1A2B6D] border border-[#1A2B6D] rounded-lg hover:bg-[#EBF4FF] transition-colors">
                Add Memory
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const Dashboard = () => {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-['Inter']">
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
