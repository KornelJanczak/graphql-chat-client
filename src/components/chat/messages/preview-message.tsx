"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Message } from "@/common/interfaces/chat";

interface PreviewMessageProps {
  message: Message;
}

export const PreviewMessage = ({ message }: PreviewMessageProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full mx-auto max-w-4xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            "group-data-[role=user]/message:w-fit"
          )}
        >
          <div className="flex flex-col gap-2 w-full">
            {message.content && (
              <div className="flex flex-row gap-2 items-start">
                <div
                  className={cn(
                    "flex flex-col gap-4",
                    "bg-primary text-primary-foreground px-3 py-2 rounded-xl"
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
