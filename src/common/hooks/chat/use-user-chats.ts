import { gql, TypedDocumentNode, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { Chat } from "../../interfaces/chat";

export const GET_USER_CHATS: TypedDocumentNode<GetUserChatsResult> = gql`
  query Chats {
    chats {
      id
      name
      createdAt
    }
  }
`;

export const useUserChats = () => {
  const toastId = "chats-toast";
  const query = useQuery<GetUserChatsResult>(GET_USER_CHATS, {
    onError: (error) => {
      console.error("Error fetching chats:", error);
      toast.error(`Error fetching chats: ${error.message}`, {
        id: toastId,
      });
    },
  });

  return {
    chats: query.data?.chats,
    ...query,
  };
};

interface GetUserChatsResult {
  chats: Pick<Chat, "id" | "createdAt" | "name">[];
}
