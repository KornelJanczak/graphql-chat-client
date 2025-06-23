"use client";

import { gql, useQuery, useSubscription } from "@apollo/client";
import { Message } from "../../interfaces/chat";
import { useEffect, useState } from "react";

const GET_CHAT_MESSAGES = gql`
  query ChatMessages($chatId: Int!) {
    chatMessages(chatId: $chatId) {
      id
      content
      createdAt
      author {
        id
        email
      }
    }
  }
`;

const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription MessageAdded($chatId: Int!) {
    messageAdded(chatId: $chatId) {
      id
      content
      createdAt
      author {
        id
      }
    }
  }
`;

export const useChatMessages = (chatId: string) => {
  // Pobierz historię wiadomości
  const { subscribeToMore, ...result } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId: parseInt(chatId) },
    skip: !chatId,
  });

  useEffect(() => {
    if (!result.data) return;

    const unsubscribe = subscribeToMore({
      document: MESSAGE_ADDED_SUBSCRIPTION,
      variables: { chatId: parseInt(chatId) },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageAdded;

        // Aktualizuj poprzednie wiadomości
        return Object.assign({}, prev, {
          chatMessages: [...prev.chatMessages, newMessage],
        });
      },
    });

    return () => {
      unsubscribe();
    };
  }, [result.data, chatId, subscribeToMore]);

  // Subskrybuj nowe wiadomości
  // const { data: subData } = useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
  //   variables: { chatId: parseInt(chatId) },
  //   skip: !chatId,
  // });

  // // Aktualizuj listę wiadomości gdy przychodzą początkowe dane
  // useEffect(() => {
  //   if (data?.chatMessages) {
  //     setMessages(data.chatMessages);
  //   }
  // }, [data]);

  // // Dodaj nową wiadomość gdy przychodzi przez subskrypcję
  // useEffect(() => {
  //   if (subData?.messageAdded) {
  //     setMessages((prev) => [...prev, subData.messageAdded]);
  //   }
  // }, [subData]);

  // return { messages, loading, error };
  return result;
};
