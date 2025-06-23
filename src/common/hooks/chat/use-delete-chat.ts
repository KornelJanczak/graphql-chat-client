import { gql, TypedDocumentNode, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Chat } from "../../interfaces/chat";
import { GET_USER_CHATS } from "./use-user-chats";

const DELETE_CHAT: TypedDocumentNode<DeleteChatResult, DeleteChatVars> = gql`
  mutation RemoveChat($id: Int!) {
    removeChat(id: $id) {
      id
      title
    }
  }
`;

interface DeleteChatVars {
  id: number;
}

interface DeleteChatResult {
  removeChat: Chat;
}

export const useDeleteChat = () => {
  const toastId = "delete-chat-toast";

  const [deleteChat, { loading, error }] = useMutation<
    DeleteChatResult,
    DeleteChatVars
  >(DELETE_CHAT, {
    onError: (error) => {
      toast.error(`Error deleting chat: ${error.message}`, {
        id: toastId,
      });
    },
    onCompleted: () => {
      toast.success("Chat deleted successfully", {
        id: toastId,
      });
    },
    refetchQueries: [GET_USER_CHATS],
    awaitRefetchQueries: false,
  });

  return { deleteChat, loading, error };
};
