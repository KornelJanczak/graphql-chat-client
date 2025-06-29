"use client";

import { TypingUser } from "@/common/interfaces/chat";
import { gql, TypedDocumentNode, useSubscription } from "@apollo/client";

// Subscription types
export interface UserStartTypingSubResponse {
  userStartTyping: TypingUser;
}

export interface UserStartTypingSubVars {
  chatId: number;
}

const USER_START_TYPING_SUBSCRIPTION: TypedDocumentNode<
  UserStartTypingSubResponse,
  UserStartTypingSubVars
> = gql`
  subscription Subscription($chatId: Int!) {
    userStartTyping(chatId: $chatId) {
      chatId
      typing
      author {
        id
        email
      }
    }
  }
`;

export const useTypingSubscription = (chatId: string) => {
  const startTypingSubscription = useSubscription(
    USER_START_TYPING_SUBSCRIPTION,
    {
      variables: { chatId: parseInt(chatId) },
    }
  );

  return {
    subscription: startTypingSubscription.data,
    ...startTypingSubscription,
  };
};
