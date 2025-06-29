"use client";

import React from "react";
import { useTextarea } from "./use-textarea";
import { useTypingStatus } from "./use-typing-status";
import { useMessageSubmission } from "./use-message-submission";
import { useAddMessage } from "../use-add-message";
import { useTypingMutation } from "../use-chat-typing/use-typing-mutation";
import { useTypingSubscription } from "../use-chat-typing/use-typing-subscription";

export const useMultiModalInput = (chatId: string) => {
  const isSubmittingRef = React.useRef(false);

  const { addMessage } = useAddMessage();
  const { startTyping } = useTypingMutation();
  const { subscription } = useTypingSubscription(chatId);
  const { textareaRef, input, updateInput, clearInput } = useTextarea();
  const { typingUsers, updateTypingStatus, stopTyping } = useTypingStatus({
    chatId,
    startTyping,
    subscription,
  });
  const { sendMessage } = useMessageSubmission({
    chatId,
    addMessage,
  });

  // Function to handle input change and adjust height
  const handleInput = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    updateInput(value);

    if (isSubmittingRef.current === true) {
      isSubmittingRef.current = false;
      return;
    }

    await updateTypingStatus();
  };

  // Function to submit the form
  const submitForm = async () => {
    isSubmittingRef.current = true;
    await stopTyping();
    await sendMessage(input);
    clearInput();
  };

  // Function to handle keydown event
  const onKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isEnterKey = event.key === "Enter" && !event.shiftKey;

    if (!isEnterKey) return;

    await submitForm();
    event.preventDefault();
  };

  return {
    submitForm,
    handleInput,
    textareaRef,
    onKeyDown,
    input,
    typingUsers,
  };
};
