"use client"
import { useState, useRef } from "react"
import DashboardLayout from "../../../components/DashboardLayout"
import Link from "next/link"
import {
  MapPin,
  ImageIcon,
  MapPinned,
  Smile,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Calendar,
  TrendingUp,
  Users,
  Send,
} from "lucide-react"

export default function SocialMediaPage() {
  const [showChallengeDetails, setShowChallengeDetails] = useState(null)
  const [postContent, setPostContent] = useState("")
  const [showComments, setShowComments] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [activeTab, setActiveTab] = useState("feed") // 'feed', 'challenges', 'events'

  // New state for image upload functionality
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  // Dynamic data with state
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Heritage Explorer",
      description: "Visit 5 UNESCO World Heritage sites in India",
      points: 500,
      locations: ["Taj Mahal", "Qutub Minar", "Red Fort", "Humayun's Tomb", "Fatehpur Sikri"],
      difficulty: "Medium",
      completedBy: 127,
      image: "/ellora_caves.jpg",
      accepted: false,
    },
    {
      id: 2,
      title: "Mountain Maven",
      description: "Visit 3 iconic hill stations in the Himalayas",
      points: 350,
      locations: ["Shimla", "Manali", "Darjeeling"],
      difficulty: "Easy",
      completedBy: 246,
      image: "https://ascentdescentadventures.com/wp-content/uploads/2023/05/Kanchenjunga-Indian-Himalayas-jpg.webp",
      accepted: false,
    },
    {
      id: 3,
      title: "Coastal Conqueror",
      description: "Check in at 4 famous beaches across India",
      points: 400,
      locations: ["Palolem Beach", "Marina Beach", "Radhanagar Beach", "Varkala Beach"],
      difficulty: "Medium",
      completedBy: 183,
      image:
        "https://static.businessworld.in/Untitled%20design%20-%202024-12-31T052430.892_20241231105033_original_image_31.webp",
      accepted: false,
    },
  ])

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Priya Sharma",
      userImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7pC6Gjryd16O2jd1ASUbt13XgJwRNsOoPvQ&s",
      location: "Jaisalmer, Rajasthan",
      time: "2 hours ago",
      content:
        "The golden city of Jaisalmer is absolutely breathtaking! The architecture, the culture, and the desert safari experience was unforgettable.",
      image: "https://www.mytourplans.com/storage/blogs/64004697c4984175_0-jaisalmer-cover-1.jpg",
      likes: 156,
      liked: false,
      comments: [
        {
          id: 1,
          user: "Rahul Kapoor",
          userImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBgMeTdvCBU_BOCab0nNON7bCPTuTU2ZgLg&s",
          text: "Amazing! I was there last month. Did you try the camel safari?",
          time: "1 hour ago",
        },
        {
          id: 2,
          user: "Meera Patel",
          userImage: "https://i.pinimg.com/736x/e4/f5/2a/e4f52af9bbb3f21beabaa134bc3b386c.jpg",
          text: "The fort looks incredible in your photo!",
          time: "30 minutes ago",
        },
      ],
    },
    {
      id: 2,
      user: "Rahul Kapoor",
      userImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBgMeTdvCBU_BOCab0nNON7bCPTuTU2ZgLg&s",
      location: "Munnar, Kerala",
      time: "5 hours ago",
      content:
        "Lost in the tea plantations of Munnar. The misty hills and lush greenery make this place heavenly. Definitely worth visiting during monsoon!",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/49/Munnar_hill_station_.JPG",
      likes: 214,
      liked: false,
      comments: [
        {
          id: 1,
          user: "Priya Sharma",
          userImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7pC6Gjryd16O2jd1ASUbt13XgJwRNsOoPvQ&s",
          text: "The greenery is stunning! How was the weather?",
          time: "4 hours ago",
        },
      ],
    },
    {
      id: 3,
      user: "Meera Patel",
      userImage: "https://i.pinimg.com/736x/e4/f5/2a/e4f52af9bbb3f21beabaa134bc3b386c.jpg",
      location: "Varanasi, Uttar Pradesh",
      time: "Yesterday",
      content:
        "Witnessing the Ganga Aarti at Dashashwamedh Ghat was a spiritual experience like no other. The energy and devotion here is incredible.",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/be/17/41/caption.jpg?w=600&h=-1&s=1",
      likes: 189,
      liked: false,
      comments: [
        {
          id: 1,
          user: "Aryan Gupta",
          userImage: "https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg",
          text: "One of the most spiritual places in India. Great capture!",
          time: "20 hours ago",
        },
        {
          id: 2,
          user: "Vikram Singh",
          userImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBgMeTdvCBU_BOCab0nNON7bCPTuTU2ZgLg&s",
          text: "The evening aarti is truly magical. Did you take a boat ride?",
          time: "18 hours ago",
        },
      ],
    },
  ])

  const [destinations, setDestinations] = useState([
    { id: 1, name: "Ladakh", hashtag: "#LehLadakh", count: "4.2K posts" },
    { id: 2, name: "Andaman Islands", hashtag: "#AndamanDiaries", count: "3.8K posts" },
    { id: 3, name: "Coorg", hashtag: "#CoorgVibes", count: "2.5K posts" },
    { id: 4, name: "Rann of Kutch", hashtag: "#RannUtsav", count: "2.1K posts" },
  ])

  const [travelBuddies, setTravelBuddies] = useState([
    {
      id: 1,
      name: "Vikram Singh",
      mutualFriends: 8,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBgMeTdvCBU_BOCab0nNON7bCPTuTU2ZgLg&s",
      following: false,
    },
    {
      id: 2,
      name: "Aryan Gupta",
      mutualFriends: 5,
      image: "https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg",
      following: false,
    },
    {
      id: 3,
      name: "Arjun Reddy",
      mutualFriends: 3,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMBgMeTdvCBU_BOCab0nNON7bCPTuTU2ZgLg&s",
      following: false,
    },
  ])

  const [events, setEvents] = useState([
    { id: 1, name: "Backpacking Northeast India", date: "Sept 15-25, 2023", attendees: 45, joined: false },
    { id: 2, name: "Photography Trip to Spiti Valley", date: "Oct 5-12, 2023", attendees: 28, joined: false },
    { id: 3, name: "Cultural Tour of South India", date: "Nov 10-20, 2023", attendees: 36, joined: false },
  ])

  // Modified handler functions
  const handleCreatePost = () => {
    if (!postContent.trim() && !imagePreview) return

    const newPost = {
      id: posts.length + 1,
      user: "You",
      userImage: "https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg",
      location: "Your Location",
      time: "Just now",
      content: postContent,
      image: imagePreview, // Add the image preview URL
      likes: 0,
      liked: false,
      comments: [],
    }

    setPosts([newPost, ...posts])
    setPostContent("")
    setSelectedImage(null)
    setImagePreview(null)
  }

  // New handler functions for image upload
  const handleImageSelect = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLikePost = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked,
          }
        }
        return post
      }),
    )
  }

  const handleAddComment = (postId) => {
    if (!commentText.trim()) return

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: post.comments.length + 1,
            user: "You",
            userImage: "https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg",
            text: commentText,
            time: "Just now",
          }

          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      }),
    )

    setCommentText("")
  }

  const handleAcceptChallenge = (challengeId) => {
    setChallenges(
      challenges.map((challenge) => {
        if (challenge.id === challengeId) {
          return {
            ...challenge,
            accepted: true,
            completedBy: challenge.completedBy + 1,
          }
        }
        return challenge
      }),
    )

    // Close the details panel
    setShowChallengeDetails(null)
  }

  const handleFollowBuddy = (buddyId) => {
    setTravelBuddies(
      travelBuddies.map((buddy) => {
        if (buddy.id === buddyId) {
          return {
            ...buddy,
            following: !buddy.following,
          }
        }
        return buddy
      }),
    )
  }

  const handleJoinEvent = (eventId) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            joined: !event.joined,
            attendees: event.joined ? event.attendees - 1 : event.attendees + 1,
          }
        }
        return event
      }),
    )
  }

  return (
    <DashboardLayout title="Social Media">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Travel Social Network</h2>
          <p className="text-black mt-1">Connect with other travelers and share your experiences</p>
        </div>
        <Link
          href="/dashboard/leaderboard"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          View Leaderboard
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b mb-8">
        <button
          onClick={() => setActiveTab("feed")}
          className={`px-4 py-2 font-medium text-sm ${activeTab === "feed" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveTab("challenges")}
          className={`px-4 py-2 font-medium text-sm ${activeTab === "challenges" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
        >
          Challenges
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 font-medium text-sm ${activeTab === "events" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
        >
          Events
        </button>
      </div>

      {activeTab === "challenges" && (
        /* Tourism Challenges Section */
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Tourism Challenges</h3>
              <p className="text-gray-600 mt-1">
                Complete these challenges by visiting famous locations across India. Earn points and climb the
                leaderboard!
              </p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium">View All Challenges</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white"
              >
                <div className="relative">
                  <img
                    src={challenge.image || "/placeholder.svg"}
                    alt={challenge.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs px-2.5 py-1.5 rounded-full font-semibold">
                    {challenge.points} pts
                  </div>
                  {challenge.accepted && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2.5 py-1.5 rounded-full font-semibold">
                      Accepted
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg text-gray-800">{challenge.title}</h4>
                  <p className="text-sm text-gray-600 mt-2">{challenge.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {challenge.completedBy} travelers completed
                    </span>
                    <span className="text-xs px-2.5 py-1 bg-gray-100 rounded-full font-medium">
                      {challenge.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowChallengeDetails(showChallengeDetails === challenge.id ? null : challenge.id)}
                    className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-800 w-full text-left flex items-center gap-1"
                  >
                    {showChallengeDetails === challenge.id ? "Hide details" : "Show details"}
                  </button>

                  {showChallengeDetails === challenge.id && (
                    <div className="mt-4 text-sm border-t pt-4">
                      <p className="font-medium mb-2 text-gray-800">Visit these locations:</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {challenge.locations.map((location, idx) => (
                          <li key={idx}>{location}</li>
                        ))}
                      </ul>
                      {!challenge.accepted ? (
                        <button
                          onClick={() => handleAcceptChallenge(challenge.id)}
                          className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Accept Challenge
                        </button>
                      ) : (
                        <div className="mt-4 text-center py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
                          Challenge Accepted
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Upcoming Travel Events</h3>
              <p className="text-gray-600 mt-1">Join travel events and connect with fellow travelers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 p-5 rounded-xl hover:shadow-md transition-all">
                <h4 className="font-bold text-lg text-gray-800">{event.name}</h4>
                <div className="flex items-center text-sm text-gray-600 mt-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <p className="text-sm text-gray-500 mt-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees} travelers joined
                </p>
                <button
                  onClick={() => handleJoinEvent(event.id)}
                  className={`mt-4 text-sm px-4 py-2 rounded-lg transition-colors w-full font-medium ${
                    event.joined
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {event.joined ? "Leave Event" : "Join Event"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "feed" && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content feed */}
          <div className="lg:w-8/12 space-y-8">
            {/* Create post */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src="https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg"
                  alt="Your Profile"
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1">
                  <textarea
                    placeholder="Share your travel experience..."
                    className="bg-gray-100 p-3 px-5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none min-h-[80px] text-gray-800 placeholder:text-gray-500 placeholder:opacity-100"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  
                  {/* Image preview */}
                  {imagePreview && (
                    <div className="mt-3 relative">
                      <img 
                        src={imagePreview} 
                        alt="Selected" 
                        className="w-full max-h-80 object-contain rounded-lg border border-gray-200" 
                      />
                      <button 
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between border-t pt-4">
                <div className="flex space-x-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    onClick={handleImageSelect} 
                    className="flex items-center text-gray-600 hover:text-blue-500 transition-colors p-2 rounded-lg"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Photo
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors p-2 rounded-lg">
                    <MapPin className="w-5 h-5 mr-2" />
                    Location
                  </button>
                  <button className="flex items-center text-gray-600 hover:text-blue-500 transition-colors p-2 rounded-lg">
                    <Smile className="w-5 h-5 mr-2" />
                    Feeling
                  </button>
                </div>
                <button
                  className={`px-5 py-2 rounded-lg transition-colors font-medium ${
                    (postContent.trim() || imagePreview)
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={handleCreatePost}
                  disabled={!postContent.trim() && !imagePreview}
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.userImage || "/placeholder.svg"}
                        alt={post.user}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{post.user}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          {post.location && (
                            <>
                              <MapPinned className="w-3 h-3 mr-1" />
                              <span>{post.location}</span>
                              <span className="mx-1.5">•</span>
                            </>
                          )}
                          <span>{post.time}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="my-4 text-gray-700">{post.content}</p>
                </div>
                {post.image && (
                  <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-96 object-cover" />
                )}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-6">
                      <button
                        className={`flex items-center space-x-2 ${post.liked ? "text-blue-600" : "text-gray-600"} hover:text-blue-500 transition-colors`}
                        onClick={() => handleLikePost(post.id)}
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="font-medium">
                          {post.likes} {post.likes === 1 ? "Like" : "Likes"}
                        </span>
                      </button>
                      <button
                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                        onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      >
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">
                          {post.comments.length} {post.comments.length === 1 ? "Comment" : "Comments"}
                        </span>
                      </button>
                    </div>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>

                  {showComments === post.id && (
                    <div className="mt-4 border-t pt-4">
                      {post.comments.length > 0 ? (
                        <div className="space-y-4 mb-4">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex space-x-3">
                              <img
                                src={comment.userImage || "/placeholder.svg"}
                                alt={comment.user}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1 bg-gray-100 p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <p className="font-medium text-sm text-gray-800">{comment.user}</p>
                                  <span className="text-xs text-gray-500">{comment.time}</span>
                                </div>
                                <p className="text-sm mt-1 text-gray-800">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 text-sm my-4 font-medium">
                          No comments yet. Be the first to comment!
                        </p>
                      )}

                      <div className="flex items-center mt-4">
                        <img
                          src="https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg"
                          alt="Your Profile"
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 mr-3"
                        />
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            className="bg-gray-100 p-2.5 pr-10 px-4 rounded-full w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 placeholder:text-gray-500 placeholder:opacity-100"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddComment(post.id)
                              }
                            }}
                          />
                          <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentText.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {showComments !== post.id && (
                    <div className="flex items-center mt-4">
                      <img
                        src="https://pbs.twimg.com/media/Fkln43cWAAEPOB1.jpg"
                        alt="Your Profile"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 mr-3"
                      />
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        className="bg-gray-100 p-2.5 px-4 rounded-full w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 placeholder:text-gray-500 placeholder:opacity-100"
                        onClick={() => setShowComments(post.id)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:w-4/12 space-y-8">
            {/* Trending destinations */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Trending Destinations
                </h3>
              </div>
              <div className="space-y-4">
                {destinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{destination.name}</p>
                      <p className="text-sm text-blue-500 mt-0.5">{destination.hashtag}</p>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {destination.count}
                    </span>
                  </div>
                ))}
              </div>
              <button className="text-blue-600 text-sm mt-4 hover:text-blue-800 font-medium w-full text-center pt-3 border-t">
                See More Destinations
              </button>
            </div>

            {/* Travel buddies suggestions */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Travel Buddies Suggestions
                </h3>
              </div>
              <div className="space-y-4">
                {travelBuddies.map((buddy) => (
                  <div
                    key={buddy.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={buddy.image || "/placeholder.svg"}
                        alt={buddy.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{buddy.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{buddy.mutualFriends} mutual friends</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollowBuddy(buddy.id)}
                      className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        buddy.following
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {buddy.following ? "Following" : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel events */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Upcoming Travel Events
                </h3>
              </div>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium text-gray-800">{event.name}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {event.date}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{event.attendees} travelers joined</p>
                    <button
                      onClick={() => handleJoinEvent(event.id)}
                      className={`mt-3 text-sm px-4 py-1.5 rounded-lg transition-colors w-full font-medium ${
                        event.joined
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {event.joined ? "Leave Event" : "Join Event"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

