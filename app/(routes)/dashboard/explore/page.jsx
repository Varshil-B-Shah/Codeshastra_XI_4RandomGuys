"use client";
import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Search, Calendar, MapPin, Heart, PlusCircle, Star } from 'react-feather';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = ['all', 'beach', 'culture', 'food', 'nightlife', 'adventure'];
  
  const trendingReels = [
    { id: 1, thumbnail: 'https://source.unsplash.com/300x500/?goa,beach', tag: '#HiddenGem', category: 'beach' },
    { id: 2, thumbnail: 'https://source.unsplash.com/300x500/?india,food', tag: '#VibeSpot', category: 'food' },
    { id: 3, thumbnail: 'https://source.unsplash.com/300x500/?india,culture', tag: '#OnlyLocalsKnow', category: 'culture' },
    { id: 4, thumbnail: 'https://source.unsplash.com/300x500/?india,adventure', tag: '#AdventureTime', category: 'adventure' },
    { id: 5, thumbnail: 'https://source.unsplash.com/300x500/?india,nightlife', tag: '#NightVibes', category: 'nightlife' },
  ];
  
  const restaurants = [
    { name: 'Fisherman\'s Wharf', location: 'South Goa', description: 'Seafood with Goan live music', rating: 4.6, tags: ['Seafood', 'Live Music'], image: 'https://source.unsplash.com/300x200/?seafood,restaurant' },
    { name: 'Suzie\'s', location: 'Assagao', description: 'Tropical fine dining in Assagao', rating: 4.8, tags: ['Fine Dining', 'Tropical'], image: 'https://source.unsplash.com/300x200/?fine,dining' },
    { name: 'Gunpowder', location: 'North Goa', description: 'South Indian cuisine in a garden setting', rating: 4.5, tags: ['South Indian', 'Garden'], image: 'https://source.unsplash.com/300x200/?indian,food' },
  ];
  
  const events = [
    { name: 'Goa Jazz Festival', date: 'April 21, 7PM', image: 'https://source.unsplash.com/300x150/?jazz,music', crowdLevel: 'High', weather: 'Clear' },
    { name: 'Sunset Yoga by the Sea', date: 'Daily, 5PM', image: 'https://source.unsplash.com/300x150/?yoga,beach', crowdLevel: 'Medium', weather: 'Clear' },
    { name: 'Anjuna Flea Market', date: 'Every Wednesday, 9AM-6PM', image: 'https://source.unsplash.com/300x150/?market,india', crowdLevel: 'High', weather: 'Sunny' },
  ];
  
  const hiddenGems = [
    { name: 'Butterfly Beach', description: 'Hike access only', image: 'https://source.unsplash.com/300x200/?butterfly,beach' },
    { name: 'Café Alchemia', description: 'Retro vibes & poetry nights', image: 'https://source.unsplash.com/300x200/?cafe,retro' },
    { name: 'Cola Beach', description: 'Secluded lagoon with few tourists', image: 'https://source.unsplash.com/300x200/?secluded,beach' },
  ];
  
  const themes = [
    { title: 'For Thrill Seekers', description: 'Surf, scuba, skydive', icon: '🏄‍♂️', image: 'https://source.unsplash.com/300x200/?surf,adventure' },
    { title: 'For Romance', description: 'Sunsets, wine & private dinners', icon: '🍷', image: 'https://source.unsplash.com/300x200/?romantic,sunset' },
    { title: 'For Soul Searchers', description: 'Temples, forest trails, meditative retreats', icon: '🌿', image: 'https://source.unsplash.com/300x200/?meditation,temple' },
  ];
  
  const travelers = [
    { name: 'Alex T.', style: 'Adventure Junkie', avatar: 'https://source.unsplash.com/100x100/?portrait,man', image: 'https://source.unsplash.com/300x300/?travel,adventure' },
    { name: 'Priya M.', style: 'Foodie Explorer', avatar: 'https://source.unsplash.com/100x100/?portrait,woman', image: 'https://source.unsplash.com/300x300/?food,travel' },
    { name: 'Marco L.', style: 'Budget Backpacker', avatar: 'https://source.unsplash.com/100x100/?portrait,traveler', image: 'https://source.unsplash.com/300x300/?backpacker' },
  ];

  const filteredReels = activeCategory === 'all' 
    ? trendingReels 
    : trendingReels.filter(reel => reel.category === activeCategory);

  return (
    <DashboardLayout title="Explore">
      {/* Hero Section */}
      <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden">
        <img 
          src="https://source.unsplash.com/1600x900/?goa,beach" 
          alt="Goa beaches" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex flex-col justify-end p-8 text-white">
          <h1 className="text-4xl font-bold mb-3">Discover the soul of Goa</h1>
          <p className="text-xl mb-6">From secret shores to street food gems!</p>
          
          <div className="bg-white rounded-full p-2 flex items-center max-w-2xl">
            <Search className="text-gray-400 ml-2 mr-4" size={20} />
            <input 
              type="text" 
              placeholder="What do you feel like today? Beach, culture, food..."
              className="flex-grow bg-transparent outline-none text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition">
              Search
            </button>
          </div>
        </div>
      </div>
      
      {/* Trending Now Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🔥 Trending Now</h2>
          <div className="flex space-x-2">
            {categories.map(category => (
              <button 
                key={category}
                className={`px-4 py-1 rounded-full text-sm ${
                  activeCategory === category 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredReels.map((reel) => (
            <div key={reel.id} className="relative h-72 rounded-lg overflow-hidden shadow-md">
              <img src={reel.thumbnail} alt="Reel thumbnail" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white">
                <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">{reel.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Top Places to Eat */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🍽️ Top Places to Eat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 flex items-center"><MapPin size={14} className="mr-1" /> {restaurant.location}</p>
                <p className="mt-1">{restaurant.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {restaurant.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Live Events & Activities */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🎉 Live Events & Activities</h2>
        <div className="flex overflow-x-auto gap-4 pb-4">
          {events.map((event, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md min-w-[280px] flex-shrink-0 overflow-hidden">
              <img src={event.image} alt={event.name} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{event.name}</h3>
                <p className="text-gray-600 flex items-center mt-1">
                  <Calendar size={14} className="mr-1" /> {event.date}
                </p>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                    👥 {event.crowdLevel} crowd
                  </span>
                  <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded">
                    ☀️ {event.weather}
                  </span>
                </div>
                <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition text-sm">
                  Add to Calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Hidden Gems Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🌄 Hidden Gems <span className="text-sm text-gray-500 font-normal">Shhh, only locals know…</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hiddenGems.map((gem, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img src={gem.image} alt={gem.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{gem.name}</h3>
                <p className="text-gray-600">{gem.description}</p>
                <button className="mt-3 flex items-center text-blue-500 hover:text-blue-600">
                  <Heart size={16} className="mr-1" /> Save for later
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Themes You'll Love */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🎨 Themes You'll Love</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={theme.image} alt={theme.title} className="w-full h-48 object-cover" />
                <span className="absolute top-3 left-3 text-4xl">{theme.icon}</span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{theme.title}</h3>
                <p className="text-gray-600">{theme.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Travelers Like You */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🧑‍🤝‍🧑 Travelers Like You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {travelers.map((traveler, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <img src={traveler.image} alt={traveler.name} className="w-full h-48 object-cover" />
              <div className="p-4 flex items-center">
                <img src={traveler.avatar} alt={traveler.name} className="w-12 h-12 rounded-full mr-3" />
                <div>
                  <h3 className="font-semibold">{traveler.name}</h3>
                  <p className="text-sm text-gray-500">{traveler.style}</p>
                </div>
                <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Map of Discoveries */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">🗺️ Map of Discoveries</h2>
        <div className="bg-white rounded-lg shadow-md p-4 h-96 relative">
          <img 
            src="https://source.unsplash.com/1200x800/?map,goa" 
            alt="Map" 
            className="w-full h-full object-cover rounded" 
          />
          <div className="absolute top-8 left-8">
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <h3 className="font-medium mb-1">Aguada Fort</h3>
              <p className="text-sm text-gray-600 mb-2">Historical landmark with sea views</p>
              <div className="flex space-x-2">
                <button className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Directions</button>
                <button className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded flex items-center">
                  <PlusCircle size={12} className="mr-1" /> Add to Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-4 text-sm">
          <span className="flex items-center"><span className="block w-3 h-3 rounded-full bg-blue-500 mr-1"></span> Stay</span>
          <span className="flex items-center"><span className="block w-3 h-3 rounded-full bg-red-500 mr-1"></span> Eat</span>
          <span className="flex items-center"><span className="block w-3 h-3 rounded-full bg-green-500 mr-1"></span> Explore</span>
          <span className="flex items-center"><span className="block w-3 h-3 rounded-full bg-purple-500 mr-1"></span> Events</span>
        </div>
      </section>
      
      {/* Floating CTA */}
      <div className="fixed bottom-8 right-8 z-10">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center transition-all transform hover:scale-105">
          <PlusCircle size={20} className="mr-2" /> Start Your Itinerary
        </button>
      </div>
    </DashboardLayout>
  );
}
