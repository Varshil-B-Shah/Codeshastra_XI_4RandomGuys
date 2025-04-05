"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layout";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Bookmark,
  Camera,
  ArrowLeft,
  Save,
} from "lucide-react";
import { gsap } from "gsap";

export default function TravelScrapBook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const bookRef = useRef(null);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [notes, setNotes] = useState({});
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [currentEditingMemory, setCurrentEditingMemory] = useState(null);

  const memories = [
    {
      id: 1,
      date: "2023-09-01",
      title: "Paris Exploration",
      image: "/api/placeholder/300/200",
      content:
        "The Eiffel Tower was even more magnificent than I could have imagined. The view from the top was breathtaking, offering a panoramic view of the entire city.",
      location: "Paris, France",
    },
    {
      id: 2,
      date: "2023-10-31",
      title: "Venice Canals",
      image: "/api/placeholder/300/200",
      content:
        "Gliding through the historic canals on a gondola was surreal. The architecture dating back centuries created a magical atmosphere.",
      location: "Venice, Italy",
    },
    {
      id: 3,
      date: "2023-12-25",
      title: "Tokyo Lights",
      image: "/api/placeholder/300/200",
      content:
        "The Shibuya Crossing was a symphony of organized chaos. At night, the neon signs illuminated the streets creating a vibrant atmosphere.",
      location: "Tokyo, Japan",
    },
    {
      id: 4,
      date: "2024-02-14",
      title: "New York Weekend",
      image: "/api/placeholder/300/200",
      content:
        "Central Park in winter was like stepping into a different world. The snow-covered landscape provided a serene contrast to the bustling city.",
      location: "New York, USA",
    },
    {
      id: 5,
      date: "2024-06-30",
      title: "Santorini Sunset",
      image: "/api/placeholder/300/200",
      content:
        "Watching the sunset from Oia was an unforgettable experience. The white buildings contrasted beautifully with the deep blue of the Aegean Sea.",
      location: "Santorini, Greece",
    },
  ];

  const totalPages = Math.ceil(memories.length / 2) * 2 + 2; // +2 for cover and intro pages

  useEffect(() => {
    // Load saved notes from localStorage
    const savedNotes = localStorage.getItem("travelNotes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    // Initialize GSAP animations
    if (bookRef.current) {
      gsap.set(bookRef.current, {
        boxShadow: "0 10px 50px rgba(0,0,0,0.2)",
      });
    }
  }, []);

  // Save notes to localStorage when they change
  useEffect(() => {
    localStorage.setItem("travelNotes", JSON.stringify(notes));
  }, [notes]);

  const filterMemories = (filter) => {
    setActiveFilter(filter);
  };

  const playPageFlipSound = () => {
    // Skip attempting to play sound if no audio file is available
    // We'll use this as a placeholder function for when you add the actual sound file
    console.log('Page flip sound would play here');
    
    // Uncomment this when you have the actual sound file available
    /*
    try {
      const sound = new Audio('/page-flip.mp3');
      sound.volume = 0.5;
      sound.play().catch(e => {
        console.log('Sound could not be played:', e.message);
      });
    } catch (error) {
      console.log('Sound playback not supported');
    }
    */
  };

  const handleNoteChange = (memoryId, noteText) => {
    setNotes((prev) => ({
      ...prev,
      [memoryId]: noteText,
    }));
  };

  const saveNote = () => {
    setIsEditingNote(false);
    // Note is already saved via state updates
  };

  const openBook = () => {
    if (isBookOpen) return;

    setIsBookOpen(true);

    // Animate the book opening with GSAP
    gsap.to(bookRef.current, {
      duration: 1.2,
      boxShadow: "0 20px 70px rgba(0,0,0,0.3)",
      ease: "power2.inOut",
    });

    // Additional GSAP animations for opening pages
    const leftPage = bookRef.current.querySelector(".left-page");
    const rightPage = bookRef.current.querySelector(".right-page");

    gsap.fromTo(
      leftPage,
      { rotateY: -90 },
      { rotateY: 0, duration: 1.2, ease: "power2.out" }
    );

    gsap.fromTo(
      rightPage,
      { rotateY: 90 },
      {
        rotateY: 0,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
          turnPage("next");
        },
      }
    );
  };

  const turnPage = (direction) => {
    if (isFlipping) return;

    // Determine next page based on direction
    const nextPage =
      direction === "next"
        ? Math.min(currentPage + 2, totalPages - 2)
        : Math.max(currentPage - 2, 0);

    if (nextPage === currentPage) return;

    setIsFlipping(true);
    setFlipDirection(direction);
    playPageFlipSound();

    // GSAP animation for page turning
    const duration = 0.8;
    const page =
      direction === "next"
        ? bookRef.current.querySelector(".right-turn-page")
        : bookRef.current.querySelector(".left-turn-page");

    // Make page visible for animation
    if (page) {
      gsap.set(page, { display: "block" });

      // Animate page turn
      gsap.fromTo(
        page,
        { rotateY: direction === "next" ? 0 : 0 },
        {
          rotateY: direction === "next" ? -180 : 180,
          duration: duration,
          ease: "power2.inOut",
          onComplete: () => {
            setCurrentPage(nextPage);
            setIsFlipping(false);
            gsap.set(page, { display: "none" });
          },
        }
      );

      // Add shadow during animation
      gsap.fromTo(
        page,
        { boxShadow: "0 0 0 rgba(0,0,0,0)" },
        {
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
          duration: duration / 2,
          yoyo: true,
          repeat: 1,
        }
      );
    } else {
      // Fallback if GSAP animation fails
      setTimeout(() => {
        setCurrentPage(nextPage);
        setIsFlipping(false);
      }, 600);
    }
  };

  // Helper to get page content
  const getPageContent = (pageIndex) => {
    // Cover (first page)
    if (pageIndex === 0) {
      return {
        front: (
          <div className="h-full w-full relative bg-blue-800 rounded-l-lg">
            <img
              src="/api/placeholder/500/700"
              alt="Travel Journal Cover"
              className="h-full w-full object-cover rounded-l-lg opacity-50"
            />
            <div className="absolute inset-0 bg-blue-900/70 flex flex-col items-center justify-center rounded-l-lg">
              <h2 className="text-4xl font-bold text-white mb-3">
                Travel Journal
              </h2>
              <div className="w-20 h-1 bg-blue-300 mb-6"></div>
              <p className="text-blue-100 text-lg mb-8">
                Capturing Moments Around the World
              </p>
            </div>
          </div>
        ),
        back: (
          <div className="h-full w-full flex items-center justify-center p-8 bg-blue-50">
            <div className="text-center p-8 rounded-lg">
              <p className="text-2xl text-blue-900 italic">
                This journal belongs to...
              </p>
            </div>
          </div>
        ),
      };
    }

    // Inside cover / First page
    if (pageIndex === 1) {
      return {
        front: (
          <div className="h-full w-full flex items-center justify-center p-8 bg-blue-50">
            <div className="text-center p-8 rounded-lg">
              <p className="text-3xl text-blue-900 mb-6">Alex Morgan</p>
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-700">
                <img
                  src="/api/placeholder/128/128"
                  alt="Journal Owner"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-6 text-blue-800 italic">2023-2024 Adventures</p>
            </div>
          </div>
        ),
        back: (
          <div className="h-full w-full flex items-center justify-center p-8 bg-blue-50">
            <div className="text-center p-8 rounded-lg">
              <p className="text-xl text-blue-900 italic">Begin Your Journey</p>
              <p className="mt-4 text-blue-700">
                Each page contains travel memories from around the world
              </p>
            </div>
          </div>
        ),
      };
    }

    // Memory pages
    const memoryIndex = Math.floor((pageIndex - 2) / 2);

    if (memoryIndex >= 0 && memoryIndex < memories.length) {
      const memory = memories[memoryIndex];

      return {
        front: (
          <div className="h-full w-full flex flex-col p-6 bg-white">
            <div className="flex-1 flex flex-col p-6 rounded-lg border border-blue-100 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-900">
                  {memory.title}
                </h3>
                <span className="text-blue-800 bg-blue-50 px-3 py-1 rounded-full text-sm border border-blue-200">
                  {new Date(memory.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="w-full">
                  <div className="bg-white p-2 shadow-md transform hover:scale-105 transition-transform relative">
                    <img
                      src={memory.image}
                      alt={memory.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 p-2 rounded-full shadow-sm text-white text-xs">
                      {memory.location}
                    </div>
                  </div>
                </div>
                <div className="text-blue-900 leading-relaxed flex-1">
                  <p className="text-base">{memory.content}</p>
                </div>
              </div>

              <div className="text-center text-blue-600 mt-4 italic text-sm">
                {pageIndex + 1}
              </div>
            </div>
          </div>
        ),
        back: (
          <div className="h-full w-full flex flex-col p-6 bg-white">
            <div className="flex-1 flex flex-col p-6 rounded-lg border border-blue-100 shadow-md">
              <div className="text-center mb-6">
                <h3 className="text-xl italic text-blue-800">
                  Notes about {memory.title}
                </h3>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex-1 border-b border-t border-blue-200 py-4">
                  {isEditingNote && currentEditingMemory === memory.id ? (
                    <div className="w-full">
                      <textarea
                        className="w-full h-48 bg-blue-50 rounded border border-blue-300 p-2 focus:outline-none focus:border-blue-500"
                        value={notes[memory.id] || ""}
                        onChange={(e) =>
                          handleNoteChange(memory.id, e.target.value)
                        }
                        placeholder="Write your travel notes here..."
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={saveNote}
                          className="bg-blue-600 text-white px-4 py-1 rounded flex items-center hover:bg-blue-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-1" /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <p className="text-blue-700 italic text-sm mb-2">
                        Your notes:
                      </p>
                      <div
                        className="w-full h-48 bg-blue-50 rounded border border-blue-300 p-3 overflow-auto"
                        onClick={() => {
                          setIsEditingNote(true);
                          setCurrentEditingMemory(memory.id);
                        }}
                      >
                        {notes[memory.id] || (
                          <span className="text-blue-400 italic">
                            Click to add notes...
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <p className="text-blue-700 italic text-sm mb-2">
                    Add a photo:
                  </p>
                  <div className="w-full h-32 bg-blue-50 rounded border border-blue-300 flex items-center justify-center hover:bg-blue-100 cursor-pointer transition-colors">
                    <Camera className="w-6 h-6 text-blue-300" />
                  </div>
                </div>
              </div>

              <div className="text-center text-blue-600 mt-4 italic text-sm">
                {pageIndex + 2}
              </div>
            </div>
          </div>
        ),
      };
    }

    // End pages
    return {
      front: (
        <div className="h-full w-full flex items-center justify-center p-8 bg-blue-50">
          <div className="text-center p-8 rounded-lg shadow-md bg-white">
            <div className="text-blue-900 text-xl mb-6">
              Add more memories to your journey...
            </div>
            <button
              onClick={() => setShowAddMemory(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" /> Create New Memory
            </button>
          </div>
        </div>
      ),
      back: (
        <div className="h-full w-full flex items-center justify-center p-8 bg-blue-50">
          <div className="text-center p-8 rounded-lg shadow-md bg-white">
            <div className="text-center text-blue-900 text-xl">
              End of Journal
            </div>
          </div>
        </div>
      ),
    };
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center py-8 bg-gradient-to-b from-blue-50 to-white min-h-screen">
        <div className="w-full max-w-6xl px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <a
                href="/dashboard"
                className="mr-4 bg-blue-100 hover:bg-blue-200 text-blue-800 p-2 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </a>
              <h1 className="text-3xl font-bold text-blue-900 flex items-center">
                <BookOpen className="w-8 h-8 mr-2 text-blue-700" />
                Travel Memories
              </h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddMemory(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-5 h-5 mr-1" /> Add Memory
              </button>
              <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300 px-4 py-2 rounded-lg flex items-center transition-colors">
                <Filter className="w-5 h-5 mr-1" /> Filter
              </button>
            </div>
          </div>

          <div className="flex flex-wrap mb-8 gap-2">
            <button
              onClick={() => filterMemories("all")}
              className={`px-4 py-2 rounded-t-lg flex items-center ${
                activeFilter === "all"
                  ? "bg-blue-800 text-white"
                  : "bg-blue-200 text-blue-900"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 mr-1 ${
                  activeFilter === "all" ? "text-blue-200" : "text-blue-700"
                }`}
              />
              All Destinations
            </button>
            <button
              onClick={() => filterMemories("europe")}
              className={`px-4 py-2 rounded-t-lg flex items-center ${
                activeFilter === "europe"
                  ? "bg-blue-800 text-white"
                  : "bg-blue-200 text-blue-900"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 mr-1 ${
                  activeFilter === "europe" ? "text-blue-200" : "text-blue-700"
                }`}
              />
              Europe
            </button>
            <button
              onClick={() => filterMemories("asia")}
              className={`px-4 py-2 rounded-t-lg flex items-center ${
                activeFilter === "asia"
                  ? "bg-blue-800 text-white"
                  : "bg-blue-200 text-blue-900"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 mr-1 ${
                  activeFilter === "asia" ? "text-blue-200" : "text-blue-700"
                }`}
              />
              Asia
            </button>
            <button
              onClick={() => filterMemories("americas")}
              className={`px-4 py-2 rounded-t-lg flex items-center ${
                activeFilter === "americas"
                  ? "bg-blue-800 text-white"
                  : "bg-blue-200 text-blue-900"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 mr-1 ${
                  activeFilter === "americas"
                    ? "text-blue-200"
                    : "text-blue-700"
                }`}
              />
              Americas
            </button>
          </div>

          {/* Book Container */}
          <div className="flex justify-center mb-10">
            <div
              ref={bookRef}
              className={`relative w-full max-w-4xl aspect-[1.5/1] flex shadow-2xl rounded-lg overflow-hidden ${
                !isBookOpen ? "cursor-pointer" : ""
              }`}
              style={{ perspective: "2500px" }}
              onClick={() => !isBookOpen && openBook()}
            >
              {/* Book binding/spine */}
              <div className="absolute h-full w-6 top-0 left-1/2 -translate-x-3 z-50 flex flex-col">
                <div className="h-full w-full bg-blue-950 flex flex-col items-center justify-center">
                  <div className="w-1 h-16 bg-blue-900 rounded-full my-2"></div>
                  <div className="w-1 h-16 bg-blue-900 rounded-full my-2"></div>
                  <div className="w-1 h-16 bg-blue-900 rounded-full my-2"></div>
                </div>
              </div>

              {/* Book base - closed book by default */}
              <div className="absolute inset-0 bg-blue-800 rounded-lg shadow-inner"></div>

              {/* Left page container */}
              <div
                className="absolute top-0 left-0 w-1/2 h-full overflow-hidden rounded-l-lg flex left-page"
                style={{ transformOrigin: "right center" }}
              >
                {/* When closed, we only see the cover */}
                {currentPage === 0 && !isFlipping ? (
                  <div className="w-full h-full">{getPageContent(0).front}</div>
                ) : (
                  <div className="w-full h-full">
                    {/* Show current left page */}
                    {getPageContent(currentPage).front}
                  </div>
                )}
              </div>

              {/* Right page container */}
              <div
                className="absolute top-0 right-0 w-1/2 h-full overflow-hidden rounded-r-lg flex right-page"
                style={{ transformOrigin: "left center" }}
              >
                {currentPage === 0 && !isFlipping ? (
                  <div className="w-full h-full bg-blue-900"></div>
                ) : (
                  <div className="w-full h-full">
                    {getPageContent(currentPage + 1).front}
                  </div>
                )}
              </div>

              {/* Page turn animations */}
              <div
                className="absolute top-0 right-0 w-1/2 h-full origin-left z-40 rounded-r-lg overflow-hidden right-turn-page"
                style={{
                  transformStyle: "preserve-3d",
                  display: "none", // Hidden by default, shown during animation
                }}
              >
                {/* Front of page being turned (right page disappearing) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {getPageContent(currentPage).back}
                </div>

                {/* Back of page being turned (becomes visible) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {getPageContent(currentPage + 1).front}
                </div>
              </div>

              <div
                className="absolute top-0 left-0 w-1/2 h-full origin-right z-40 rounded-l-lg overflow-hidden left-turn-page"
                style={{
                  transformStyle: "preserve-3d",
                  display: "none", // Hidden by default, shown during animation
                }}
              >
                {/* Front of page being turned (left page disappearing) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {getPageContent(currentPage - 2).front}
                </div>

                {/* Back of page being turned (becomes visible) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(-180deg)",
                  }}
                >
                  {getPageContent(currentPage - 1).back}
                </div>
              </div>

              {/* Page shadows */}
              <div className="absolute pointer-events-none inset-0 z-30">
                <div
                  className="absolute left-0 w-1/2 h-full"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 20%)",
                    opacity: currentPage > 0 ? 1 : 0,
                  }}
                ></div>
                <div
                  className="absolute right-0 w-1/2 h-full"
                  style={{
                    background:
                      "linear-gradient(to left, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 20%)",
                    opacity: currentPage < totalPages - 2 ? 1 : 0,
                  }}
                ></div>
              </div>

              {/* Click to open prompt if book is closed */}
              {!isBookOpen && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/80 px-6 py-3 rounded-full text-blue-900 font-medium animate-pulse shadow-lg">
                    Click to open journal
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page navigation controls - only show when book is open */}
          {isBookOpen && (
            <div className="flex justify-center space-x-12 items-center mb-8">
              <button
                onClick={() => turnPage("prev")}
                disabled={currentPage === 0 || isFlipping}
                className={`flex items-center px-5 py-2 rounded-full ${
                  currentPage === 0 || isFlipping
                    ? "bg-blue-200 text-blue-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </button>

              <div className="text-blue-900">
                {currentPage === 0
                  ? "Cover"
                  : `Pages ${currentPage + 1}-${currentPage + 2}`}
              </div>

              <button
                onClick={() => turnPage("next")}
                disabled={currentPage >= totalPages - 2 || isFlipping}
                className={`flex items-center px-5 py-2 rounded-full ${
                  currentPage >= totalPages - 2 || isFlipping
                    ? "bg-blue-200 text-blue-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors`}
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          )}

          {/* Add Memory Modal - to be implemented */}
          {showAddMemory && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  Add New Memory
                </h3>

                <form className="space-y-4">
                  <div>
                    <label className="block text-blue-800 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Memory title"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-800 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-800 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-800 mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="Write about your memory..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-blue-800 mb-1">Photo</label>
                    <div className="w-full h-32 border border-dashed border-blue-300 rounded flex items-center justify-center bg-blue-50 cursor-pointer hover:bg-blue-100">
                      <Camera className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddMemory(false)}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Save Memory
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
