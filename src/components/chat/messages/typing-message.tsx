"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageWithAuthor } from "@/common/interfaces/chat";
import { useAuthContext } from "@/common/providers/auth-provider";
import { User } from "@/common/interfaces/user";

interface TypingMessageProps {
  author: User;
}

export const TypingMessage = ({ author }: TypingMessageProps) => {
  const { user } = useAuthContext();
  const isCurrentUser = user?.id === author.id;

  if (isCurrentUser) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          "w-full mx-auto max-w-4xl px-4 group/message flex",
          "justify-start"
        )}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-full">
            {
              <span className="text-xs text-muted-foreground mb-1 block">
                {author.email} writing...
              </span>
            }

            <div className="flex flex-row gap-2 items-start">
              <div
                className={cn(
                  "flex flex-col gap-4 px-3 py-2 rounded-xl",
                  "bg-muted text-foreground"
                )}
              >
                <span>...</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
