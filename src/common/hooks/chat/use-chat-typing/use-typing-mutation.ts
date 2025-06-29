"use client";

import { TypingUser } from "@/common/interfaces/chat";
import { gql, TypedDocumentNode, useMutation } from "@apollo/client";

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

export const useTypingMutation = () => {
  const [startTyping, mutation] = useMutation<
    UserStartTypingResult,
    UserStartTypingVars
  >(START_TYPING_MUTATION);

  return { startTyping, ...mutation };
};
