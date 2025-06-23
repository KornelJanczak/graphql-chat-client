"use client";

import type React from "react";
import { useRef, useEffect, useCallback, useState } from "react";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { useAddMessage } from "./use-add-message";

export const useMultiModalInput = (chatId: string) => {
  const { addMessage } = useAddMessage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaElement = textareaRef.current;
  const [input, setInput] = useState<string>("");
  const { width } = useWindowSize();

  useEffect(() => {
    if (textAreaElement) adjustHeight();
  }, []);

  const adjustHeight = () => {
    if (textAreaElement) {
      textAreaElement.style.height = "auto";
      textAreaElement.style.height = `${textAreaElement.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textAreaElement) {
      textAreaElement.style.height = "auto";
      textAreaElement.style.height = "98px";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    ""
  );

  // Function to handle the textarea input change
  useEffect(() => {
    if (!textAreaElement) return;

    // Prefer DOM value over localStorage to handle hydration
    const domValue = textAreaElement.value;
    const finalValue = domValue || localStorageInput || "";
    setInput(finalValue);
    adjustHeight();
  }, []);

  // Function to handle input change and adjust height
  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  // Function to handle input change and adjust height
  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    console.log("Input value changed:", value);

    setInput(value);
    adjustHeight();
  };

  // Function to submit the form
  const submitForm = async () => {
    console.log("input submit", input);

    await addMessage({
      variables: {
        addMessageInput: {
          chatId: parseInt(chatId),
          content: input,
        },
      },
    });
    setLocalStorageInput("");
    resetHeight();
    setInput("");
    if (width && width > 768) textAreaElement?.focus();
  };

  // Function to handle keydown event
  const onKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    {
      const isEnterKey = event.key === "Enter" && !event.shiftKey;

      if (!isEnterKey) return;
      console.log("input", input);

      await submitForm();
      event.preventDefault();
    }
  };

  return {
    submitForm,
    handleInput,
    textareaRef,
    onKeyDown,
    input,
  };
};
