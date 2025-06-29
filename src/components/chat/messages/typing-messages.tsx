import { useScrollToBottom } from "@/common/hooks/_shared/use-scroll-to-bottom";
import { TypingUser } from "@/common/interfaces/chat";
import { TypingMessage } from "./typing-message";

export interface TypingMessagesProps {
  typingUsers: TypingUser[];
}

export function TypingMesseges({ typingUsers }: TypingMessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {typingUsers.map(({ author }) => (
        <TypingMessage key={author.id} author={author} />
      ))}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}
