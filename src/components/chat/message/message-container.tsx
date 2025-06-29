"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MessageContainerProps {
  children: ReactNode;
  isRight?: boolean;
  className?: string;
}

export const MessageContainer = ({
  children,
  isRight = false,
  className,
}: MessageContainerProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={cn(
          "w-full mx-auto max-w-4xl px-4 group/message flex",
          isRight ? "justify-end" : "justify-start",
          className
        )}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -5, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-full">{children}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
