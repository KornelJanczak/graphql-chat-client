// import { Message } from "ai";
// import { ThinkingMessage } from "./thinking-message";
import { PreviewMessage } from "./preview-message";
// import equal from "fast-deep-equal";
import { memo } from "react";
import { useScrollToBottom } from "@/common/hooks/_shared/use-scroll-to-bottom";
import { Message } from "@/common/interfaces/chat";

export interface MessagesProps {
  //   isLoading: boolean;
  messages: Array<Message>;
}

export function Messages({ messages }: MessagesProps) {
  const messagesExist = messages.length > 0;
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.map((message) => (
        <PreviewMessage key={message.id} message={message} />
      ))}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}
