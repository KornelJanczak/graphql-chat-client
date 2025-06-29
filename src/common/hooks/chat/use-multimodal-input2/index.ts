"use client";

import type React from "react";
import { useTextarea } from "./use-textarea";
import { useTypingStatus } from "./use-typing-status";
import { useMessageSubmission } from "./use-message-submission";
import { useAddMessage } from "../use-add-message";
import { useChatTyping } from "../use-chat-typing";

export const useMultiModalInput = (chatId: string) => {
  const { addMessage } = useAddMessage();
  const {
    startTypingMutation: { startTyping },
    startTypingSubscription: { data: subscriptionData },
  } = useChatTyping(chatId);

  // Hook odpowiedzialny za textarea
  const { textareaRef, input, updateInput, clearInput } = useTextarea();

  // Hook odpowiedzialny za obsługę statusu pisania
  const { typingUsers, updateTypingStatus, stopTyping, resetTypingTimeout } =
    useTypingStatus({
      chatId,
      startTyping,
      subscriptionData,
    });

  // Hook odpowiedzialny za wysyłanie wiadomości
  const { sendMessage } = useMessageSubmission({
    chatId,
    addMessage,
  });

  // Function to handle input change and adjust height
  const handleInput = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    updateInput(value);

    await updateTypingStatus();
  };

  // Function to submit the form
  const submitForm = async () => {
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
