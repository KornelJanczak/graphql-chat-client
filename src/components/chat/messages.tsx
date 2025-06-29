"use client";

import { useScrollToBottom } from "@/common/hooks/_shared/use-scroll-to-bottom";
import { MessageWithAuthor, TypingUser } from "@/common/interfaces/chat";
import { PreviewMessage } from "./message/preview-message";
import { TypingMessage } from "./message/typing-message";

export interface MessagesProps {
  messages: MessageWithAuthor[];
  typingUsers?: TypingUser[];
}

export function Messages({ messages, typingUsers }: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const typingUsersExist = typingUsers && typingUsers.length > 0;

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.map((message) => (
        <PreviewMessage key={message.id} message={message} />
      ))}

      {typingUsersExist &&
        typingUsers.map(({ author }) => (
          <TypingMessage key={author.id} author={author} />
        ))}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}
