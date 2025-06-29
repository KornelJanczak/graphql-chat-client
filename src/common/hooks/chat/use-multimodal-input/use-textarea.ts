"use client";

import { useRef, useEffect, useState } from "react";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

export const useTextarea = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState<string>("");
  const textAreaElement = textareaRef.current;
  const { width } = useWindowSize();
  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    ""
  );

  // Update input height when the component mounts
  useEffect(() => {
    if (textAreaElement) adjustHeight();
  }, []);

  // Initialize input from local storage
  useEffect(() => {
    if (!textAreaElement) return;
    const domValue = textAreaElement.value;
    const finalValue = domValue || localStorageInput || "";
    setInput(finalValue);
    adjustHeight();
  }, []);

  // Save input to local storage
  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

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

  const updateInput = (value: string) => {
    setInput(value);
    adjustHeight();
  };

  const clearInput = () => {
    setLocalStorageInput("");
    resetHeight();
    setInput("");
    if (width && width > 768) textAreaElement?.focus();
  };

  return {
    textareaRef,
    input,
    updateInput,
    clearInput,
    adjustHeight,
  };
};
