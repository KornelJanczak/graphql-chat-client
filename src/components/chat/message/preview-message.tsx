"use client";

import { MessageWithAuthor } from "@/common/interfaces/chat";
import { useAuthContext } from "@/common/providers/auth-provider";
import { MessageContainer } from "./message-container";
import { MessageAuthor } from "./message-author";
import { MessageContent } from "./message-content";

interface PreviewMessageProps {
  message: MessageWithAuthor;
}

export const PreviewMessage = ({ message }: PreviewMessageProps) => {
  const { user } = useAuthContext();
  const isMyMessage = user?.id === message.author.id;

  return (
    <MessageContainer isRight={isMyMessage}>
      {!isMyMessage && <MessageAuthor email={message.author.email} />}
      {message.content && (
        <MessageContent isRight={isMyMessage}>
          <span>{message.content as string}</span>
        </MessageContent>
      )}
    </MessageContainer>
  );
};
