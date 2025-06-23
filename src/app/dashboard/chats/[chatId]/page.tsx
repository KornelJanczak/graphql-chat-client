"use client";

import { useChatMessages } from "@/common/hooks/chat/use-chat-messages";
import { Messages } from "@/components/chat/messages/messages";
import { MultimodalInput } from "@/components/chat/messages/multimodal-input";
import { useParams } from "next/navigation";

export default function ChatDetails() {
  const { chatId } = useParams<{ chatId: string }>();
  const result = useChatMessages(chatId);

  console.log('ChatDetails result:', result);
  

  return (
    <section className="flex flex-col min-w-0 h-dvh bg-background">
      <Messages messages={result.data} />
      <MultimodalInput chatId={chatId} />
    </section>
  );
}
