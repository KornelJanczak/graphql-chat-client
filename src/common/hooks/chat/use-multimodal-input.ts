"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { useLocalStorage, useWindowSize } from "usehooks-ts";
import { useAddMessage } from "./use-add-message";
import { useChatTyping } from "./use-chat-typing";
import { TypingUser } from "@/common/interfaces/chat";

export const useMultiModalInput = (chatId: string) => {
  const { addMessage } = useAddMessage();
  const {
    startTypingMutation: { startTyping },
    startTypingSubscription: { data: subscriptionData },
  } = useChatTyping(chatId);

  const [typingUsers, setTypingUsers] = useState<TypingUser[] | undefined>(
    undefined
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState<string>("");
  const [typing, setTyping] = useState<boolean>(false);
  const textAreaElement = textareaRef.current;
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    // If there is no subscription data or userStartTyping, reset typing users
    if (!subscriptionData || !subscriptionData.userStartTyping)
      return setTypingUsers(undefined);

    const newUser = subscriptionData.userStartTyping;

    setTypingUsers((prevUsers?: TypingUser[]) => {
      // Jeśli nie ma poprzednich użytkowników, utwórz tablicę z nowym użytkownikiem
      if (!prevUsers) return [newUser];

      // Sprawdź, czy użytkownik o tym ID już istnieje
      const existingUserIndex = prevUsers.findIndex(
        (user) => user.author.id === newUser.author.id
      );

      // Jeśli użytkownik już istnieje, zastąp go
      if (existingUserIndex !== -1) {
        const updatedUsers = [...prevUsers];
        updatedUsers[existingUserIndex] = newUser;

        return updatedUsers.filter(({ typing }) => typing === true);
      }

      // Jeśli użytkownik nie istnieje, dodaj go do tablicy
      return [...prevUsers, newUser];
    });
  }, [subscriptionData?.userStartTyping]);

  const resetTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Update input height when the component mounts
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
  const handleInput = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInput(value);
    adjustHeight();

    // Anuluj poprzedni timeout, jeśli istnieje
    resetTypingTimeout();

    // Debounce the typing event to avoid too many calls
    if (!typing) {
      const { data } = await startTyping({
        variables: {
          startTypingEventInput: {
            chatId: parseInt(chatId),
            typing: true,
          },
        },
      });

      setTyping(data?.startTypingEvent || false);
    }

    // Ustaw nowy timeout, który wyłączy status typing po 5 sekundach bezczynności
    typingTimeoutRef.current = setTimeout(async () => {
      const { data } = await startTyping({
        variables: {
          startTypingEventInput: {
            chatId: parseInt(chatId),
            typing: false,
          },
        },
      });

      setTyping(data?.startTypingEvent || false);
      typingTimeoutRef.current = null;
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);

        startTyping({
          variables: {
            startTypingEventInput: {
              chatId: parseInt(chatId),
              typing: false,
            },
          },
        }).catch((error) => {
          console.error("Error sending final typing status:", error);
        });
      }
    };
  }, [chatId, startTyping]);

  // Function to submit the form
  const submitForm = async () => {
    await startTyping({
      variables: {
        startTypingEventInput: {
          chatId: parseInt(chatId),
          typing: false,
        },
      },
    });

    setTyping(false);
    resetTypingTimeout();

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
