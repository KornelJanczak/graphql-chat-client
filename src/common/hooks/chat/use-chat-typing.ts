"use client";

import { TypingUser } from "@/common/interfaces/chat";
import {
  gql,
  TypedDocumentNode,
  useMutation,
  useSubscription,
} from "@apollo/client";

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

const START_TYPING_MUTATION: TypedDocumentNode<
  UserStartTypingResult,
  UserStartTypingVars
> = gql`
  mutation StartTypingEvent($startTypingEventInput: StartTypingEventInput!) {
    startTypingEvent(startTypingEventInput: $startTypingEventInput) {
      chatId
      typing
      author {
        email
        id
      }
    }
  }
`;

export const useChatTyping = (chatId: string) => {
  const startTypingSubscription = useSubscription(
    USER_START_TYPING_SUBSCRIPTION,
    {
      variables: { chatId: parseInt(chatId) },
    }
  );

  const [startTyping, mutation] = useMutation<
    UserStartTypingResult,
    UserStartTypingVars
  >(START_TYPING_MUTATION);

  return {
    startTypingMutation: { startTyping, ...mutation },
    startTypingSubscription,
  };
};

// Mutation types
export interface UserStartTypingVars {
  startTypingEventInput: {
    chatId: number;
    typing: boolean;
  };
}

export interface UserStartTypingResult {
  startTypingEvent: TypingUser;
}

//Subscription types
export interface UserStartTypingSubResponse {
  userStartTyping: TypingUser;
}

export interface UserStartTypingSubVars {
  chatId: number;
}
