"use client";
import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { RealtimeChat } from '@/components/realtime-chat';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { Search, Users, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { YouTubeResults } from '@/components/youtube-results';
import { WeatherDisplay } from '@/components/weather-display';

const GROUPS = [
  { id: 'group-1', name: 'General Discussion', description: 'Chat about anything', icon: '👋', color: 'from-blue-500 to-cyan-500' },
  { id: 'group-2', name: 'Technical Support', description: 'Get help with issues', icon: '🔧', color: 'from-amber-500 to-orange-500' },
  { id: 'group-3', name: 'Random Chat', description: 'Casual conversations', icon: '💬', color: 'from-purple-500 to-pink-500' },
];

export default function GroupChatPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [selectedGroup, setSelectedGroup] = useState(GROUPS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  
  if (!isLoaded || !isSignedIn) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  const filteredGroups = GROUPS.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAiMention = async (text) => {
    try {
      // Check if text contains @ai mention
      if (text.includes('@ai')) {
        // Show browser warning about the API call
        console.warn('Making API call to external ngrok service');
        
        const response = await fetch('https://a8d1-103-207-59-158.ngrok-free.app/askai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
        
        const data = await response.json();
        setAiResponse(data);
      }
    } catch (error) {
      console.error('Error calling AI service:', error);
    }
  };

  const renderAiResponse = () => {
    if (!aiResponse) return null;
    
    if (aiResponse.tool_data?.tool_name === 'yt') {
      return <YouTubeResults response={aiResponse.tool_data.response} />;
    } else if (aiResponse.tool_data?.tool_name === 'weather') {
      return <WeatherDisplay data={aiResponse.tool_data.response} />;
    }
    
    return null;
  };

  return (
    <DashboardLayout title="Group Chats">
      <div className="flex h-[calc(100vh-120px)] bg-slate-50 dark:bg-gray-900 rounded-lg overflow-x-hidden border border-slate-200 dark:border-slate-800 shadow-md">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search groups"
                className="pl-9 bg-white dark:bg-gray-800 border-slate-200 dark:border-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Group List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-3">
              <div className="flex items-center text-xs text-muted-foreground mb-2 px-2">
                <Users className="mr-1 h-3 w-3" />
                <span>GROUPS</span>
              </div>
              
              {filteredGroups.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  No groups found
                </div>
              ) : (
                filteredGroups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={cn(
                      "w-full text-left mb-1 p-3 rounded-md transition-colors",
                      "hover:bg-slate-200 dark:hover:bg-slate-800/80",
                      selectedGroup.id === group.id 
                        ? "bg-slate-200 dark:bg-slate-800/60" 
                        : "bg-transparent"
                    )}
                  >
                    <div className="flex items-start">
                      <div className={cn(
                        "h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white mr-3",
                        group.color
                      )}>
                        <span className="text-lg">{group.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{group.name}</h3>
                          <span className="text-xs text-muted-foreground">Today</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {group.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {aiResponse && renderAiResponse()}
          {selectedGroup ? (
            <RealtimeChat 
              roomName={selectedGroup.id} 
              username={user.emailAddresses[0].emailAddress}
              onMessageSend={handleAiMention}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Select a group</h3>
                <p className="text-muted-foreground text-sm">
                  Choose a group from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
