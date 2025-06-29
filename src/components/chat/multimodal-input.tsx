"use client";

import type React from "react";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

interface MultimodalInputProps {
  submitForm: (e: React.FormEvent) => Promise<void>;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => Promise<void>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => Promise<void>;
  input: string;
  className?: string;
}

export function MultimodalInput({
  submitForm,
  handleInput,
  textareaRef,
  onKeyDown,
  input,
  className,
}: MultimodalInputProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm(e);
  };

  return (
    <form
      className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-4xl"
      onSubmit={handleSubmit}
    >
      <div className="relative w-full flex flex-col gap-4">
        <Textarea
          ref={textareaRef}
          placeholder="Send a message..."
          value={input}
          onChange={handleInput}
          className={cn(
            "min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl !text-base bg-muted pb-10 dark:border-zinc-700",
            className
          )}
          rows={2}
          autoFocus
          onKeyDown={onKeyDown}
        />
      </div>
    </form>
  );
}
