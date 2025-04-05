"use client"
import { useState, useEffect } from "react"
import DashboardLayout from "../../../components/DashboardLayout"
import { Trophy, MapPin, Award, Users, Star, Filter, ArrowUp, ArrowDown, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("points")
  const [sortDirection, setSortDirection] = useState("desc")
  const [leaderboardData, setLeaderboardData] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Sample leaderboard data
  const initialLeaderboardData = [
    {
      id: 1,
      name: "Rahul Sharma",
      image: "https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg",
      points: 1750,
      challengesCompleted: 12,
      placesVisited: 34,
      badges: ["Heritage Master", "Mountain Explorer", "Beach Lover"],
      rank: 1,
      category: "heritage",
    },
    {
      id: 2,
      name: "Priya Patel",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7pC6Gjryd16O2jd1ASUbt13XgJwRNsOoPvQ&s",
      points: 1620,
      challengesCompleted: 10,
      placesVisited: 28,
      badges: ["Temple Explorer", "Wildlife Enthusiast"],
      rank: 2,
      category: "heritage",
    },
    {
      id: 3,
      name: "Vikram Mehra",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBgMeTdvCBU_BOCab0nNON7bCPTuTU2ZgLg&s",
      points: 1580,
      challengesCompleted: 9,
      placesVisited: 30,
      badges: ["Water Adventure Pro", "Cultural Explorer"],
      rank: 3,
      category: "adventure",
    },
    {
      id: 4,
      name: "Anjali Singh",
      image: "https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg",
      points: 1480,
      challengesCompleted: 8,
      placesVisited: 27,
      badges: ["Mountain Maven", "Heritage Enthusiast"],
      rank: 4,
      category: "adventure",
    },
    {
      id: 5,
      name: "Karan Kapoor",
      image: "https://image.lexica.art/md2_webp/c4d602de-40bd-4aa9-8ea5-93950678fe79",
      points: 1350,
      challengesCompleted: 7,
      placesVisited: 24,
      badges: ["Beach Conqueror"],
      rank: 5,
      category: "adventure",
    },
    {
      id: 6,
      name: "Neha Gupta",
      image: "https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg",
      points: 1220,
      challengesCompleted: 6,
      placesVisited: 20,
      badges: ["City Explorer"],
      rank: 6,
      category: "heritage",
    },
    {
      id: 7,
      name: "Amit Verma",
      image: "https://i.pinimg.com/474x/6f/1c/df/6f1cdff8f0579281e0dcb100830b1fcc.jpg",
      points: 1150,
      challengesCompleted: 5,
      placesVisited: 18,
      badges: ["Foodie Traveler"],
      rank: 7,
      category: "heritage",
    },
  ]

  // Stats about challenges
  const statsCards = [
    { title: "Total Places", value: "500+", icon: <MapPin className="w-6 h-6" />, color: "blue" },
    { title: "Active Challenges", value: "24", icon: <Trophy className="w-6 h-6" />, color: "green" },
    { title: "Total Participants", value: "2,450", icon: <Users className="w-6 h-6" />, color: "purple" },
    { title: "Points Earned", value: "145,780", icon: <Star className="w-6 h-6" />, color: "amber" },
  ]

  // Filter and sort the leaderboard data
  useEffect(() => {
    let filteredData = [...initialLeaderboardData]

    // Apply category filter
    if (categoryFilter !== "all") {
      filteredData = filteredData.filter((user) => user.category === categoryFilter)
    }

    // Apply time filter (this would normally fetch from API with different time ranges)
    // For demo purposes, we'll just use the same data

    // Apply sorting
    filteredData.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1

      switch (sortBy) {
        case "points":
          return direction * (a.points - b.points)
        case "places":
          return direction * (a.placesVisited - b.placesVisited)
        case "challenges":
          return direction * (a.challengesCompleted - b.challengesCompleted)
        default:
          return direction * (a.points - b.points)
      }
    })

    // Update ranks based on new sorting
    filteredData = filteredData.map((user, index) => ({
      ...user,
      rank: index + 1,
    }))

    setLeaderboardData(filteredData)
  }, [timeFilter, categoryFilter, sortBy, sortDirection])

  // Toggle sort direction
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("desc")
    }
  }

  // Filter color classes
  const getFilterClass = (current, filter) =>
    current === filter ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"

  // Get color class for stats cards
  const getColorClass = (color) => {
    switch (color) {
      case "blue":
        return "border-[#1A2B6D] bg-[#EBF4FF] text-[#1A2B6D]"
      case "green":
        return "border-[#009688] bg-[#E6FFFA] text-[#009688]"
      case "purple":
        return "border-[#9F7AEA] bg-[#F3E8FF] text-[#9F7AEA]"
      case "amber":
        return "border-[#FF5722] bg-[#FFFBEB] text-[#FF5722]"
      default:
        return "border-[#2D3748] bg-[#F9FAFB] text-[#2D3748]"
    }
  }

  return (
    <DashboardLayout title="Leaderboard">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#2D3748]">Travel Masters Leaderboard</h2>
          <p className="text-[#4A5568] mt-1">See who's leading the pack in travel experiences across India</p>
        </div>
        <Link
          href="/dashboard/social"
          className="flex items-center text-[#1A2B6D] hover:text-[#009688] font-medium transition-all"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Social
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-md p-5 border-t-4 ${getColorClass(stat.color)} flex items-center justify-between transition-all hover:shadow-lg hover:scale-105 duration-300`}
          >
            <div>
              <h3 className="text-[#4A5568] text-sm font-medium">{stat.title}</h3>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full bg-opacity-20 ${getColorClass(stat.color)}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[#E2E8F0] transition-all hover:shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <h3 className="text-xl font-bold text-[#2D3748] mb-3 sm:mb-0 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-[#FF5722]" />
            Leaderboard Rankings
          </h3>
        </div>

        {/* Top 3 Winners */}
        {leaderboardData.length > 0 && (
          <div className="flex flex-col md:flex-row justify-center items-end mb-16 space-y-8 md:space-y-0 relative">
            {/* 2nd Place */}
            {leaderboardData.length > 1 && (
              <div className="flex flex-col items-center mx-4 md:order-1 relative animate-fadeIn">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#E2E8F0] w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                  2
                </div>
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#E2E8F0] mb-2 shadow-lg">
                  <img
                    src={leaderboardData[1]?.image || "/placeholder.svg"}
                    alt={leaderboardData[1]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#E2E8F0] text-center p-4 rounded-xl w-full max-w-[180px] shadow-md">
                  <h4 className="font-bold text-[#2D3748]">{leaderboardData[1]?.name}</h4>
                  <p className="text-xl font-bold mt-1">{leaderboardData[1]?.points} pts</p>
                  <div className="text-sm text-[#4A5568] mt-1 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {leaderboardData[1]?.placesVisited} places
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {leaderboardData.length > 0 && (
              <div className="flex flex-col items-center mx-4 md:order-2 relative z-10 transform md:scale-110 animate-fadeIn">
                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-[#FF5722] w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                  1
                </div>
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#FF5722] mb-2 shadow-lg">
                  <img
                    src={leaderboardData[0]?.image || "/placeholder.svg"}
                    alt={leaderboardData[0]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gradient-to-b from-[#FF5722] to-[#FF7E67] text-center p-5 rounded-xl w-full max-w-[200px] shadow-lg">
                  <h4 className="font-bold text-white">{leaderboardData[0]?.name}</h4>
                  <p className="text-2xl font-bold mt-1 text-white">{leaderboardData[0]?.points} pts</p>
                  <div className="text-sm text-white mt-1 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {leaderboardData[0]?.placesVisited} places
                  </div>
                  <div className="mt-2 flex flex-wrap justify-center gap-1">
                    {leaderboardData[0]?.badges.slice(0, 2).map((badge, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {leaderboardData.length > 2 && (
              <div className="flex flex-col items-center mx-4 md:order-3 relative animate-fadeIn">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#CD7F32] w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md">
                  3
                </div>
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#CD7F32] mb-2 shadow-lg">
                  <img
                    src={leaderboardData[2]?.image || "/placeholder.svg"}
                    alt={leaderboardData[2]?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-[#CD7F32] text-white text-center p-4 rounded-xl w-full max-w-[180px] shadow-md">
                  <h4 className="font-bold">{leaderboardData[2]?.name}</h4>
                  <p className="text-xl font-bold mt-1">{leaderboardData[2]?.points} pts</p>
                  <div className="text-sm mt-1 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {leaderboardData[2]?.placesVisited} places
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Table for the rest */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#F9FAFB] text-[#2D3748]">
                <th className="py-3 px-4 text-left font-semibold">Rank</th>
                <th className="py-3 px-4 text-left font-semibold">Traveler</th>
                <th className="py-3 px-4 text-left font-semibold cursor-pointer" onClick={() => handleSort("places")}>
                  <div className="flex items-center">
                    Places Visited
                    {sortBy === "places" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left font-semibold cursor-pointer"
                  onClick={() => handleSort("challenges")}
                >
                  <div className="flex items-center">
                    Challenges
                    {sortBy === "challenges" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="py-3 px-4 text-left font-semibold">Badges</th>
                <th className="py-3 px-4 text-right font-semibold cursor-pointer" onClick={() => handleSort("points")}>
                  <div className="flex items-center justify-end">
                    Points
                    {sortBy === "points" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.slice(3).map((user) => (
                <tr key={user.id} className="border-t hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-bold text-[#2D3748]">{user.rank}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover border border-[#E2E8F0]"
                      />
                      <span className="font-medium text-[#2D3748]">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#4A5568]">{user.placesVisited}</td>
                  <td className="py-4 px-4 text-[#4A5568]">{user.challengesCompleted}</td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {user.badges.map((badge, idx) => (
                        <span key={idx} className="px-2 py-1 bg-[#EBF4FF] text-[#1A2B6D] text-xs rounded-full">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-[#2D3748]">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How to earn points */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-[#E2E8F0] transition-all hover:shadow-lg">
        <h3 className="text-xl font-bold text-[#2D3748] mb-6 flex items-center">
          <Award className="w-5 h-5 mr-2 text-[#1A2B6D]" />
          How to Earn Points
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-xl p-5 bg-[#EBF4FF] hover:shadow-md transition-all hover:scale-105 duration-300">
            <h4 className="font-semibold mb-2 text-[#1A2B6D]">Visit Popular Destinations</h4>
            <p className="text-sm text-[#4A5568]">
              Check-in at popular tourist spots to earn 50-100 points per location.
            </p>
          </div>
          <div className="border rounded-xl p-5 bg-[#E6FFFA] hover:shadow-md transition-all hover:scale-105 duration-300">
            <h4 className="font-semibold mb-2 text-[#009688]">Complete Challenges</h4>
            <p className="text-sm text-[#4A5568]">Finish themed challenges to earn 200-500 points per challenge.</p>
          </div>
          <div className="border rounded-xl p-5 bg-[#F3E8FF] hover:shadow-md transition-all hover:scale-105 duration-300">
            <h4 className="font-semibold mb-2 text-[#9F7AEA]">Share Travel Stories</h4>
            <p className="text-sm text-[#4A5568]">Post your experiences with photos to earn 20-50 points per post.</p>
          </div>
          <div className="border rounded-xl p-5 bg-[#FFFBEB] hover:shadow-md transition-all hover:scale-105 duration-300">
            <h4 className="font-semibold mb-2 text-[#FF5722]">Earn Badges</h4>
            <p className="text-sm text-[#4A5568]">
              Collect special badges for themed achievements for 100-300 bonus points.
            </p>
          </div>
          <div className="border rounded-xl p-5 bg-[#FEEBEF] hover:shadow-md transition-all hover:scale-105 duration-300">
            <h4 className="font-semibold mb-2 text-[#FF7E67]">Hidden Gems</h4>
            <p className="text-sm text-[#4A5568]">Discover and check-in at lesser-known spots for 75-150 points.</p>
          </div>
          <div className="border rounded-xl p-5 bg-[#EEF2FF] hover:shadow-md transition-all hover:scale-105 duration-300">
            <h4 className="font-semibold mb-2 text-[#4C63B6]">Refer Friends</h4>
            <p className="text-sm text-[#4A5568]">Get 100 points for each friend who joins the challenge.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

