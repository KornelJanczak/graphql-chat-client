"use client";

import { useAuthContext } from "@/common/providers/auth-provider";
import { User } from "@/common/interfaces/user";
import { MessageContainer } from "./message-container";
import { MessageAuthor } from "./message-author";
import { MessageContent } from "./message-content";
import { TypingIndicator } from "./typing-indicator";

interface TypingMessageProps {
  author: User;
}

export const TypingMessage = ({ author }: TypingMessageProps) => {
  const { user } = useAuthContext();
  const isCurrentUser = user?.id === author.id;

  if (isCurrentUser) return null;

  return (
    <MessageContainer>
      <MessageAuthor email={author.email} isTyping={true} />
      <MessageContent>
        <TypingIndicator />
      </MessageContent>
    </MessageContainer>
  );
};
