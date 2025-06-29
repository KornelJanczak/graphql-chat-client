"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageWithAuthor } from "@/common/interfaces/chat";
import { useAuthContext } from "@/common/providers/auth-provider";

interface PreviewMessageProps {
  message: MessageWithAuthor;
}

export const PreviewMessage = ({ message }: PreviewMessageProps) => {
  const { user } = useAuthContext();
  const isMyMessage = user?.id === message.author.id;

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "w-full mx-auto max-w-4xl px-4 group/message flex",
          isMyMessage ? "justify-end" : "justify-start"
        )}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-full">
            {!isMyMessage && (
              <span className="text-xs text-muted-foreground mb-1 block">
                {message.author.email}
              </span>
            )}
            {message.content && (
              <div className="flex flex-row gap-2 items-start">
                <div
                  className={cn(
                    "flex flex-col gap-4 px-3 py-2 rounded-xl",
                    isMyMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <span>{message.content as string}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
