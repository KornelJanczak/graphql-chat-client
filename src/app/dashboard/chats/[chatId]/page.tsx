"use client";

import { useChatMessages } from "@/common/hooks/chat/use-chat-messages";
import { useMultiModalInput } from "@/common/hooks/chat/use-multimodal-input/index";
import { Messages } from "@/components/chat/messages";
import { MultimodalInput } from "@/components/chat/multimodal-input";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useParams } from "next/navigation";

export default function ChatDetails() {
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, loading, error } = useChatMessages(chatId);
  const {
    submitForm,
    handleInput,
    textareaRef,
    input,
    onKeyDown,
    typingUsers,
  } = useMultiModalInput(chatId);

  return (
    <section className="flex flex-col min-w-0 h-dvh bg-background">
      {messages && <Messages messages={messages} typingUsers={typingUsers} />}
      {error && (
        <div className="text-red-500">
          Error loading messages: {error.message}
        </div>
      )}
      {!loading && !messages && <EmptyState message="No message " />}
      {loading && <LoadingState />}
      <MultimodalInput
        submitForm={submitForm}
        handleInput={handleInput}
        textareaRef={textareaRef}
        input={input}
        onKeyDown={onKeyDown}
      />
    </section>
  );
}
