"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MessageContentProps {
  children: ReactNode;
  isRight?: boolean;
  className?: string;
}

export const MessageContent = ({
  children,
  isRight = false,
  className,
}: MessageContentProps) => {
  return (
    <div className="flex flex-row gap-2 items-start">
      <div
        className={cn(
          "flex flex-col gap-4 px-3 py-2 rounded-xl",
          isRight
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
