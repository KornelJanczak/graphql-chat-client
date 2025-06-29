"use client";

import { cn } from "@/lib/utils";

interface MessageAuthorProps {
  email: string;
  isTyping?: boolean;
  className?: string;
}

export const MessageAuthor = ({
  email,
  isTyping = false,
  className,
}: MessageAuthorProps) => {
  return (
    <span className={cn("text-xs text-muted-foreground mb-1 block", className)}>
      {email}
      {isTyping ? " is typing..." : ""}
    </span>
  );
};
