import { gql, TypedDocumentNode, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Chat } from "../../interfaces/chat";
import { GET_USER_CHATS } from "./use-user-chats";

const CREATE_CHAT: TypedDocumentNode<CreateChatResult, CreateChatVars> = gql`
  mutation CreateChat($createChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatInput) {
      name
      members {
        email
      }
    }
  }
`;

export const useCreateChat = () => {
  const toastId = "create-chat-toast";

  const [createChat, { loading, error }] = useMutation<
    CreateChatResult,
    CreateChatVars
  >(CREATE_CHAT, {
    onError: (error) => {
      toast.error(`Error creating chat: ${error.message}`, {
        id: toastId,
      });
    },
    onCompleted: () => {
      toast.success("Chat created successfully", {
        id: toastId,
      });
    },
    refetchQueries: [GET_USER_CHATS],
    awaitRefetchQueries: false,
  });

  return { createChat, loading, error };
};

interface CreateChatInput {
  name: string;
  membersEmails: string[];
}

interface CreateChatVars {
  createChatInput: CreateChatInput;
}

interface CreateChatResult {
  createChat: Chat;
}
