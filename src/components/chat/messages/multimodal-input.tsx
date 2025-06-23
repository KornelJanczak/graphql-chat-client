"use client";

import type React from "react";
import { memo } from "react";
import { Textarea } from "../../ui/textarea";
import { useMultiModalInput } from "@/common/hooks/chat/use-multimodal-input";
import { cn } from "@/lib/utils";

interface PureMultiModalInputProps
  extends React.HTMLAttributes<HTMLFormElement> {
  chatId: string;
}

export function MultimodalInput({
  chatId,
  ...restOfProps
}: PureMultiModalInputProps) {
  const { className, ...multiModalInputProps } = restOfProps;
  const { textareaRef, handleInput, onKeyDown, submitForm, input } =
    useMultiModalInput(chatId);

  return (
    <form
      className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-4xl"
      onSubmit={submitForm}
      {...multiModalInputProps}
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
