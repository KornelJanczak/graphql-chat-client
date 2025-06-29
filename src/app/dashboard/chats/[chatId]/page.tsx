"use client";

import { useChatMessages } from "@/common/hooks/chat/use-chat-messages";
import { useChatTyping } from "@/common/hooks/chat/use-chat-typing";
import { Messages } from "@/components/chat/messages/messages";
import { MultimodalInput } from "@/components/chat/messages/multimodal-input";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useParams } from "next/navigation";

export default function ChatDetails() {
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, loading, error } = useChatMessages(chatId);

  return (
    <section className="flex flex-col min-w-0 h-dvh bg-background">
      {messages && <Messages messages={messages} />}
      {error && (
        <div className="text-red-500">
          Error loading messages: {error.message}
        </div>
      )}
      {!loading && !messages && <EmptyState message="No message " />}
      {loading && <LoadingState />}
      <MultimodalInput chatId={chatId} />
    </section>
  );
}
