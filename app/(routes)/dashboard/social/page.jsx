"use client";
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

export default function SocialMediaPage() {
  return (
    <DashboardLayout title="Social Media">
      <h2 className="text-2xl font-bold mb-6">Travel Social Network</h2>
      <p className="mb-6">Connect with other travelers and share your experiences</p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Content feed */}
        <div className="lg:w-8/12 space-y-6">
          {/* Create post */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center space-x-4 mb-4">
              <img src="https://source.unsplash.com/random/100x100/?portrait" alt="Your Profile" className="w-10 h-10 rounded-full object-cover" />
              <input type="text" placeholder="Share your travel experience..." className="bg-gray-100 p-2 px-4 rounded-full w-full" />
            </div>
            <div className="flex justify-between border-t pt-3">
              <button className="flex items-center text-gray-600 hover:text-blue-500">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Photo
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-500">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Location
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-500">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Feeling
              </button>
              <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Post
              </button>
            </div>
          </div>

          {/* Posts */}
          {[
            {
              user: 'Priya Sharma',
              location: 'Jaisalmer, Rajasthan',
              time: '2 hours ago',
              content: 'The golden city of Jaisalmer is absolutely breathtaking! The architecture, the culture, and the desert safari experience was unforgettable.',
              image: 'https://source.unsplash.com/random/600x400/?jaisalmer,rajasthan',
              likes: 156,
              comments: 24
            },
            {
              user: 'Rahul Kapoor',
              location: 'Munnar, Kerala',
              time: '5 hours ago',
              content: 'Lost in the tea plantations of Munnar. The misty hills and lush greenery make this place heavenly. Definitely worth visiting during monsoon!',
              image: 'https://source.unsplash.com/random/600x400/?munnar,kerala,tea',
              likes: 214,
              comments: 36
            },
            {
              user: 'Meera Patel',
              location: 'Varanasi, Uttar Pradesh',
              time: 'Yesterday',
              content: 'Witnessing the Ganga Aarti at Dashashwamedh Ghat was a spiritual experience like no other. The energy and devotion here is incredible.',
              image: 'https://source.unsplash.com/random/600x400/?varanasi,ganga',
              likes: 189,
              comments: 42
            }
          ].map((post, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img src={`https://source.unsplash.com/random/100x100/?portrait&${index}`} alt={post.user} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{post.user}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{post.location}</span>
                        <span className="mx-1">•</span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>
                  <button>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                    </svg>
                  </button>
                </div>
                <p className="my-3">{post.content}</p>
              </div>
              <img src={post.image} alt="Post" className="w-full h-80 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                      </svg>
                      <span>{post.likes} Likes</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                      </svg>
                      <span>{post.comments} Comments</span>
                    </button>
                  </div>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
                <div className="flex items-center mt-4">
                  <img src="https://source.unsplash.com/random/100x100/?portrait" alt="Your Profile" className="w-8 h-8 rounded-full object-cover mr-3" />
                  <input type="text" placeholder="Write a comment..." className="bg-gray-100 p-2 rounded-full w-full text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:w-4/12 space-y-6">
          {/* Trending destinations */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Trending Destinations</h3>
            <div className="space-y-3">
              {[
                { name: 'Ladakh', hashtag: '#LehLadakh', count: '4.2K posts' },
                { name: 'Andaman Islands', hashtag: '#AndamanDiaries', count: '3.8K posts' },
                { name: 'Coorg', hashtag: '#CoorgVibes', count: '2.5K posts' },
                { name: 'Rann of Kutch', hashtag: '#RannUtsav', count: '2.1K posts' },
              ].map((destination, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{destination.name}</p>
                    <p className="text-sm text-blue-500">{destination.hashtag}</p>
                  </div>
                  <span className="text-xs text-gray-500">{destination.count}</span>
                </div>
              ))}
            </div>
            <button className="text-blue-600 text-sm mt-3 hover:underline">
              See More
            </button>
          </div>

          {/* Travel buddies suggestions */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Travel Buddies Suggestions</h3>
            <div className="space-y-4">
              {[
                { name: 'Vikram Singh', mutualFriends: 8, image: 'https://source.unsplash.com/random/100x100/?man,portrait' },
                { name: 'Ananya Gupta', mutualFriends: 5, image: 'https://source.unsplash.com/random/100x100/?woman,portrait' },
                { name: 'Arjun Reddy', mutualFriends: 3, image: 'https://source.unsplash.com/random/100x100/?indian,man' },
              ].map((buddy, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={buddy.image} alt={buddy.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-medium">{buddy.name}</p>
                      <p className="text-xs text-gray-500">{buddy.mutualFriends} mutual friends</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Travel events */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3">Upcoming Travel Events</h3>
            <div className="space-y-4">
              {[
                { name: 'Backpacking Northeast India', date: 'Sept 15-25, 2023', attendees: 45 },
                { name: 'Photography Trip to Spiti Valley', date: 'Oct 5-12, 2023', attendees: 28 },
                { name: 'Cultural Tour of South India', date: 'Nov 10-20, 2023', attendees: 36 },
              ].map((event, index) => (
                <div key={index} className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium">{event.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{event.date}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.attendees} travelers joined</p>
                  <button className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                    Join Event
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
