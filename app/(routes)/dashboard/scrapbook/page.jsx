"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layout";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bookmark,
  Camera,
  ArrowLeft,
  Save,
} from "lucide-react";
import { gsap } from "gsap";

export default function TravelScrapBook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const bookRef = useRef(null);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [flipDirection, setFlipDirection] = useState("next");
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [notes, setNotes] = useState({});
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [currentEditingMemory, setCurrentEditingMemory] = useState(null);
  const [memories, setMemories] = useState([
    {
      id: 1,
      date: "2024-10-12",
      title: "Siddhivinayak Darshan",
      image: "/mumabi1.jpg",
      content:
        "Visited the iconic Siddhivinayak Temple in Mumbai today. The spiritual energy and the peaceful ambiance inside the temple were truly uplifting. Joined the early morning aarti and experienced a deep sense of calm and devotion. The intricate architecture of the temple and the devotion of the crowd made it a memorable and soulful experience.",
      location: "Mumabi, Maharashtra",
    },
    {
      id: 2,
      date: "2024-11-25",
      title: "Mahakaleshwar Darshan",
      image: "/ujjain1.jpg",
      content:
        "Had the divine opportunity to visit the sacred Mahakaleshwar Jyotirlinga in Ujjain. The early morning Bhasma Aarti was a once-in-a-lifetime experience, filled with chants, devotion, and an overwhelming sense of spiritual energy. The temple’s ancient architecture and the atmosphere of faith made it an unforgettable journey into the heart of Indian spirituality.",
      location: "Ujjain, Madhya Pradesh",
    },
    {
      id: 3,
      date: "2025-01-06",
      title: "Konark Temple Visit",
      image: "/orissa1.jpg",
      content:
        "Visited the stunning Konark Sun Temple, famous for its chariot-like design and intricate carvings. A true masterpiece of ancient Indian architecture.",
      location: "Konark, Odisha",
    },
  ]);

  const totalPages = memories.length * 2 + 2; // 2 pages per memory + 2 for cover and intro

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

  const playPageFlipSound = () => {
    // Skip attempting to play sound if no audio file is available
    // We'll use this as a placeholder function for when you add the actual sound file
    console.log("Page flip sound would play here");

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
          <div className="h-full w-full relative bg-[#8b4513] rounded-l-lg">
            <img
              src="/api/placeholder/500/700"
              alt="Travel Journal Cover"
              className="h-full w-full object-cover rounded-l-lg opacity-50"
            />
            <div className="absolute inset-0 bg-[#8b4513]/70 flex flex-col items-center justify-center rounded-l-lg">
              <h2 className="text-4xl font-handwriting text-[#f4e4bc] mb-3 transform -rotate-2">
                Travel Journal
              </h2>
              <div className="w-20 h-1 bg-[#d4b483] mb-6"></div>
              <p className="text-[#f4e4bc] text-lg mb-8 font-handwriting">
                Capturing Moments Around the World
              </p>
            </div>
          </div>
        ),
        back: (
          <div className="h-full w-full flex items-center justify-center p-8 bg-[#f4e4bc]">
            <div className="text-center p-8 rounded-lg">
              <p className="text-2xl text-[#5c3518] italic">
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
          <div className="h-full w-full flex items-center justify-center p-8 bg-[#f4e4bc]">
            <div className="text-center p-8 rounded-lg">
              <p className="text-3xl text-[#5c3518] mb-6">Alex Morgan</p>
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#8b4513]">
                <img
                  src="/api/placeholder/128/128"
                  alt="Journal Owner"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-6 text-[#5c3518] italic">2023-2024 Adventures</p>
            </div>
          </div>
        ),
        back: (
          <div className="h-full w-full flex items-center justify-center p-8 bg-[#f4e4bc]">
            <div className="text-center p-8 rounded-lg">
              <p className="text-xl text-[#5c3518] italic">
                Begin Your Journey
              </p>
              <p className="mt-4 text-[#8b4513]">
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
      const isLeftPage = pageIndex % 2 === 1; // Odd pages are left pages

      if (isLeftPage) {
        return {
          front: (
            <div className="h-full w-full flex flex-col p-6 bg-[#f4e4bc]">
              <div className="flex-1 flex p-6 rounded-lg border-2 border-[#8b4513] shadow-vintage">
                <div className="w-full">
                  <div className="memory-image-wrapper h-full">
                    <div className="tape-corner tape-corner-tl"></div>
                    <div className="tape-corner tape-corner-br"></div>
                    <img
                      src={memory.image}
                      alt={memory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 memory-location px-3 py-1 rounded-lg shadow-sm">
                      {memory.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
          back: null,
        };
      } else {
        return {
          front: (
            <div className="h-full w-full flex flex-col p-6 bg-[#f4e4bc]">
              <div className="flex-1 flex flex-col p-6 rounded-lg border-2 border-[#8b4513] shadow-vintage">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="memory-title text-2xl">{memory.title}</h3>
                  <span className="memory-date px-3 py-1 rounded-full text-sm">
                    {new Date(memory.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="bg-white/50 p-6 rounded-lg border border-[#8b4513] flex-1">
                  <div className="memory-content">
                    <p className="text-base">{memory.content}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-[#8b4513] italic text-sm">
                    {pageIndex + 1}
                  </div>
                  <div className="flex items-center">
                    <img
                      src="/polaroid-icon.png"
                      alt="Memory stamp"
                      className="w-8 h-8 opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          ),
          back: null,
        };
      }
    }

    // End pages
    return {
      front: (
        <div className="h-full w-full flex items-center justify-center p-8 bg-[#f4e4bc]">
          <div className="text-center p-8 rounded-lg shadow-md bg-white">
            <div className="text-[#8b4513] text-xl mb-6">
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
        <div className="h-full w-full flex items-center justify-center p-8 bg-[#f4e4bc]">
          <div className="text-center p-8 rounded-lg shadow-md bg-white">
            <div className="text-center text-[#5c3518] text-xl">
              End of Journal
            </div>
          </div>
        </div>
      ),
    };
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const imageFile = formData.get("image");

    const newMemory = {
      id: memories.length + 1,
      title: formData.get("title"),
      location: formData.get("location"),
      date: formData.get("date"),
      content: formData.get("content"),
      image: URL.createObjectURL(imageFile),
    };

    setMemories((prev) => [...prev, newMemory]);
    setShowAddMemory(false);

    // Turn to the new memory's pages
    const newMemoryStartPage = memories.length * 2 + 2;
    setCurrentPage(newMemoryStartPage);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center py-8 bg-[#f4e4bc] min-h-screen">
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
            <button
              onClick={() => setShowAddMemory(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <Plus className="w-5 h-5 mr-1" /> Add Memory
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
              <div className="absolute h-full w-6 top-0 left-1/2 -translate-x-3 z-50 flex flex-col book-spine">
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <div className="w-4 h-24 bg-[#5c3518] rounded-full my-2 opacity-30"></div>
                  <div className="w-4 h-24 bg-[#5c3518] rounded-full my-2 opacity-30"></div>
                </div>
              </div>

              {/* Book base - closed book by default */}
              <div className="absolute inset-0 bg-[#5c3518] rounded-lg shadow-inner"></div>

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
                  <div className="w-full h-full bg-[#8b4513]"></div>
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
                    ? "bg-[#d4b483] text-[#8b4513] cursor-not-allowed"
                    : "bg-[#8b4513] text-[#f4e4bc] hover:bg-[#5c3518]"
                } transition-colors`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </button>

              <div className="text-[#5c3518] font-handwriting">
                {currentPage === 0
                  ? "Cover"
                  : `Pages ${currentPage + 1}-${currentPage + 2}`}
              </div>

              <button
                onClick={() => turnPage("next")}
                disabled={currentPage >= totalPages - 2 || isFlipping}
                className={`flex items-center px-5 py-2 rounded-full ${
                  currentPage >= totalPages - 2 || isFlipping
                    ? "bg-[#d4b483] text-[#8b4513] cursor-not-allowed"
                    : "bg-[#8b4513] text-[#f4e4bc] hover:bg-[#5c3518]"
                } transition-colors`}
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          )}

          {/* Add Memory Modal */}
          {showAddMemory && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#f4e4bc] rounded-lg max-w-lg w-full p-6 shadow-xl border-2 border-[#8b4513]">
                <h3 className="text-xl font-handwriting text-[#5c3518] mb-4">
                  Add New Memory
                </h3>

                <form className="space-y-4" onSubmit={handleAddMemory}>
                  <div>
                    <label className="block text-[#8b4513] mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="w-full p-2 border-2 border-[#8b4513] rounded bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#5c3518]"
                      placeholder="Memory title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#8b4513] mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      className="w-full p-2 border-2 border-[#8b4513] rounded bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#5c3518]"
                      placeholder="City, Country"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#8b4513] mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="w-full p-2 border-2 border-[#8b4513] rounded bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#5c3518]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[#8b4513] mb-1">
                      Description
                    </label>
                    <textarea
                      name="content"
                      className="w-full p-2 border-2 border-[#8b4513] rounded bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#5c3518] h-32"
                      placeholder="Write about your memory..."
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[#8b4513] mb-1">Photo</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="w-full p-2 border-2 border-[#8b4513] rounded bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#5c3518]"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddMemory(false)}
                      className="px-4 py-2 bg-[#d4b483] text-[#5c3518] rounded hover:bg-[#c4a473] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#8b4513] text-[#f4e4bc] rounded hover:bg-[#5c3518] transition-colors"
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
