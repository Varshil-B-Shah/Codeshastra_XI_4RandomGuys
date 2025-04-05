"use client";
import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { RealtimeChat } from '@/components/realtime-chat';
import { useUser } from '@clerk/nextjs';

export default function GroupChatPage() {
  const {isSignedIn, user, isLoaded} = useUser();
  console.log(user.emailAddresses[0].emailAddress);
  

  return (
    <DashboardLayout title="Group Chat">
      <RealtimeChat roomName="my-chat-room" username={`${user.emailAddresses[0].emailAddress}`} />
    </DashboardLayout>
  );
}
