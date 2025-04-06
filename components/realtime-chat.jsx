'use client';
import { cn } from '@/lib/utils'
import { useChatScroll } from '@/hooks/use-chat-scroll'
import { useRealtimeChat } from '@/hooks/use-realtime-chat';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, User, UserCircle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns';
import { YouTubeResults } from './youtube-results';
import { WeatherDisplay } from './weather-display';

// Enhanced message bubble component
const ChatMessageBubble = ({ message, isOwnMessage, showHeader }) => {
  const date = new Date(message.createdAt);
  const formattedTime = format(date, 'h:mm a');
  
  // Generate color based on username (consistent for same username)
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-yellow-500', 'bg-red-500',
      'bg-indigo-500', 'bg-orange-500', 'bg-teal-500'
    ];
    
    // Simple hash function to pick consistent color
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }
  
  const renderMessageContent = (message) => {
    if (message.componentData) {
      if (message.componentData.type === 'youtube') {
        return (
          <div className="mt-2">
            <div>{message.content}</div>
            <div className="mt-2">
              <YouTubeResults response={message.componentData.data} />
            </div>
          </div>
        );
      } else if (message.componentData.type === 'weather') {
        return (
          <div className="mt-2">
            <div>{message.content}</div>
            <div className="mt-2">
              <WeatherDisplay data={message.componentData.data} />
            </div>
          </div>
        );
      }
    }
    return message.content;
  };

  return (
    <div className={cn(
      "flex gap-2 max-w-[80%]",
      isOwnMessage ? "ml-auto flex-row-reverse" : ""
    )}>
      {/* Avatar */}
      {showHeader && !isOwnMessage && (
        <div className="flex flex-col items-center mt-1">
          <div className={cn(
            "flex items-center justify-center rounded-full w-8 h-8 text-white font-medium",
            getAvatarColor(message.user.name)
          )}>
            {message.user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      
      <div className="flex flex-col">
        {/* Username and time */}
        {showHeader && (
          <div className={cn(
            "flex gap-2 text-xs mb-1",
            isOwnMessage ? "flex-row-reverse" : ""
          )}>
            <span className="font-medium">{message.user.name}</span>
            <span className="text-muted-foreground">{formattedTime}</span>
          </div>
        )}
        
        {/* Message bubble */}
        <div className={cn(
          "rounded-2xl px-4 py-2 break-words",
          isOwnMessage 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-muted rounded-tl-none"
        )}>
          {renderMessageContent(message)}
        </div>
        
        {/* Time only (when not showing header) */}
        {!showHeader && (
          <div className={cn(
            "text-xs text-muted-foreground mt-1",
            isOwnMessage ? "text-right" : "text-left"
          )}>
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
}

// Date separator component
const DateSeparator = ({ date }) => {
  const formattedDate = format(new Date(date), 'MMMM d, yyyy');
  
  return (
    <div className="flex items-center justify-center my-6">
      <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
        {formattedDate}
      </div>
    </div>
  );
}

/**
 * Enhanced Realtime chat component
 * @param roomName - The name of the room to join. Each room is a unique chat.
 * @param username - The username of the user
 * @param onMessage - The callback function to handle the messages.
 * @param messages - The messages to display in the chat.
 * @param onMessageSend - The callback function to handle message sending.
 * @returns The chat component
 */
export const RealtimeChat = ({
  roomName,
  username,
  onMessage,
  messages: initialMessages = [],
  onMessageSend
}) => {
  const { containerRef, scrollToBottom } = useChatScroll()

  const {
    messages: realtimeMessages,
    sendMessage: sendRealtimeMessage,
    isConnected,
  } = useRealtimeChat({
    roomName,
    username,
  })
  
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  // Merge realtime messages with initial messages
  const allMessages = useMemo(() => {
    const mergedMessages = [...initialMessages, ...realtimeMessages]
    // Remove duplicates based on message id
    const uniqueMessages = mergedMessages.filter(
      (message, index, self) => index === self.findIndex((m) => m.id === message.id)
    )
    // Sort by creation date
    return uniqueMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }, [initialMessages, realtimeMessages])

  useEffect(() => {
    if (onMessage) {
      onMessage(allMessages)
    }
  }, [allMessages, onMessage])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [allMessages, scrollToBottom])

  const handleSendMessage = useCallback((e) => {
    e.preventDefault()
    if (!newMessage.trim() || !isConnected) return
    
    // Call the AI mention handler callback if provided
    if (onMessageSend) {
      onMessageSend(newMessage, (aiMessage, componentData) => {
        const aiResponseMessage = {
          id: Date.now().toString(),
          content: aiMessage,
          user: { name: 'AI Assistant' },
          createdAt: new Date().toISOString(),
          componentData: componentData
        };
        realtimeMessages.push(aiResponseMessage);
      });
    }

    sendRealtimeMessage(newMessage)
    setNewMessage('')
  }, [newMessage, isConnected, sendRealtimeMessage, onMessageSend, realtimeMessages])

  // Group messages by date
  const messagesByDate = useMemo(() => {
    const grouped = {};
    
    allMessages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    
    return grouped;
  }, [allMessages]);

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground antialiased">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <UserCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">{roomName}</h3>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
            {allMessages.length} messages
          </div>
        </div>
      </div>
      
      {/* Messages */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
      >
        {Object.keys(messagesByDate).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <Send className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground">
              Start the conversation by sending a message below
            </p>
          </div>
        ) : (
          Object.entries(messagesByDate).map(([date, messages]) => (
            <div key={date} className="space-y-6">
              <DateSeparator date={messages[0].createdAt} />
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const prevMessage = index > 0 ? messages[index - 1] : null;
                  const timeDiff = prevMessage 
                    ? new Date(message.createdAt) - new Date(prevMessage.createdAt) 
                    : 0;
                  
                  // Show header if different user or more than 5 minutes between messages
                  const showHeader = !prevMessage || 
                    prevMessage.user.name !== message.user.name ||
                    timeDiff > 5 * 60 * 1000;
                  
                  return (
                    <div
                      key={message.id}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-200"
                    >
                      <ChatMessageBubble
                        message={message}
                        isOwnMessage={message.user.name === username}
                        showHeader={showHeader}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Input */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm sticky bottom-0">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center w-full gap-2 p-4"
        >
          <Input
            className={cn(
              'rounded-full bg-muted border-none text-sm transition-all duration-300 focus-visible:ring-primary',
              isConnected && newMessage.trim() ? 'w-[calc(100%-56px)]' : 'w-full'
            )}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
          />
          {isConnected && newMessage.trim() && (
            <Button
              className="aspect-square rounded-full animate-in fade-in slide-in-from-right-4 duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
              type="submit"
              disabled={!isConnected}
            >
              <Send className="size-4" />
            </Button>
          )}
        </form>
        
        {/* Connection status indicator */}
        {!isConnected && (
          <div className="flex items-center justify-center pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Connecting to chat...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}