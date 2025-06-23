"use client";

import { useUserChats } from "@/common/hooks/chat/use-user-chats";
import { ChatCard } from "@/components/cards/chat-card";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function ChatsPage() {
  const { chats, loading, error } = useUserChats();

  const isChatsExisting = chats && chats.length > 0;

  console.log("Chats:", chats);
  console.log("isChatsExisting:", isChatsExisting);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Chats</h1>
      {isChatsExisting && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chats.map(({ id, createdAt, name }) => (
            <ChatCard key={id} chat={{ id, createdAt, name }} />
          ))}
        </div>
      )}
      {!isChatsExisting && !loading && (
        <EmptyState message="No chats found. Start a new chat!" />
      )}
      {loading && <LoadingState text="Loading chats..." />}
      {error && (
        <EmptyState
          message={`Error loading chats: ${error.message}`}
          className="text-red-500"
        />
      )}
    </div>
  );
}
