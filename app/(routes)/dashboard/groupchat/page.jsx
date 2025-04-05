"use client";
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';

export default function GroupChatPage() {
  return (
    <DashboardLayout title="Group Chat">
      <h2 className="text-2xl font-bold mb-6">Group Conversations</h2>
      <p className="mb-4">Chat with fellow travelers</p>
      
      <div className="flex h-[500px] bg-white rounded-lg shadow-md overflow-hidden">
        {/* Chat list sidebar */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="overflow-y-auto h-full">
            {[
              { name: 'Rajasthan Trip Planning', lastMessage: 'Does anyone know a good hotel in Udaipur?', active: true },
              { name: 'Kerala Backwaters 2023', lastMessage: 'I have shared the boat house details', active: false },
              { name: 'Himalayan Trekkers', lastMessage: 'Weather forecast looks good for next week', active: false }
            ].map((chat, index) => (
              <div 
                key={index} 
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${chat.active ? 'bg-blue-50' : ''}`}
              >
                <h4 className="font-medium">{chat.name}</h4>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="w-2/3 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold">Rajasthan Trip Planning</h3>
            <p className="text-sm text-gray-500">8 members</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Chat messages would go here */}
            <div className="flex items-start gap-2">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">A</div>
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <p className="font-semibold text-sm">Ankit</p>
                <p>Hey everyone! I'm planning the Rajasthan trip for October. Who's confirmed?</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2 flex-row-reverse">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">Y</div>
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
                <p className="font-semibold text-sm">You</p>
                <p>I'm in! Has anyone been to Jaisalmer before?</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
