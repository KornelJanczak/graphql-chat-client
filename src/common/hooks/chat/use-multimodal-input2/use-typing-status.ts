"use client";

import { useEffect, useRef, useState } from "react";
import { TypingUser } from "@/common/interfaces/chat";
import {
  MutationFunctionOptions,
  ApolloCache,
  DefaultContext,
  FetchResult,
} from "@apollo/client";
import { UserStartTypingResult, UserStartTypingVars } from "../use-chat-typing";

interface UseTypingStatusProps {
  chatId: string;
  startTyping: (
    options?: MutationFunctionOptions<
      UserStartTypingResult,
      UserStartTypingVars,
      DefaultContext,
      ApolloCache<any>
    >
  ) => Promise<FetchResult<UserStartTypingResult>>;
  subscriptionData?: {
    userStartTyping?: TypingUser;
  };
}

export const useTypingStatus = ({
  chatId,
  startTyping,
  subscriptionData,
}: UseTypingStatusProps) => {
  const [typingUsers, setTypingUsers] = useState<TypingUser[] | undefined>(
    undefined
  );
  const [typing, setTyping] = useState<boolean>(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle typing status subscription data
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
    if (!typingTimeoutRef.current) return;
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = null;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (!typingTimeoutRef.current) return;
      
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;

      // Ensure typing status is set to false when component unmounts
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
    };
  }, [chatId, startTyping]);

  const handleTypingStatus = async (isTyping: boolean) => {
    try {
      const result = await startTyping({
        variables: {
          startTypingEventInput: {
            chatId: parseInt(chatId),
            typing: isTyping,
          },
        },
      });

      if (result.data?.startTypingEvent) {
        // Używamy wartości isTyping przekazanej do funkcji, zamiast próbować ją odczytać z odpowiedzi
        setTyping(isTyping);
      }
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  const updateTypingStatus = async () => {
    // Anuluj poprzedni timeout, jeśli istnieje
    resetTypingTimeout();

    // Start typing if not already typing
    if (!typing) await handleTypingStatus(true);

    // Set timeout to stop typing after inactivity
    typingTimeoutRef.current = setTimeout(async () => {
      await handleTypingStatus(false);
      typingTimeoutRef.current = null;
    }, 5000);
  };

  const stopTyping = async () => {
    resetTypingTimeout();
    await handleTypingStatus(false);
  };

  return {
    typingUsers,
    updateTypingStatus,
    stopTyping,
    resetTypingTimeout,
  };
};
