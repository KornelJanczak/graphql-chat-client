"use client";

import { gql, TypedDocumentNode, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { Message } from "@/common/interfaces/chat";
import { User } from "@/common/interfaces/user";

const GET_CHAT_MESSAGES: GetChatMessages = gql`
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

const MESSAGE_ADDED_SUBSCRIPTION: MessageAddedSubscriptionResult = gql`
  subscription MessageAdded($chatId: Int!) {
    messageAdded(chatId: $chatId) {
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

export const useChatMessages = (chatId: string) => {
  // Pobierz historię wiadomości
  const { subscribeToMore, ...result } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId: parseInt(chatId) },
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

  return { ...result, messages: result.data?.chatMessages };
};

interface GetChatMessagesResult
  extends Pick<Message, "id" | "content" | "createdAt"> {
  author: User;
}

type GetChatMessages = TypedDocumentNode<{
  chatMessages: GetChatMessagesResult[];
}>;

type MessageAddedSubscriptionResult = TypedDocumentNode<{
  messageAdded: GetChatMessagesResult;
}>;
