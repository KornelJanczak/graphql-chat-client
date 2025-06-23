import { gql, TypedDocumentNode, useMutation } from "@apollo/client";
import { toast } from "sonner";

export const ADD_MESSAGE: TypedDocumentNode<
  AddMessageResult,
  AddMessageVars
> = gql`
  mutation AddMessage($addMessageInput: AddMessageInput!) {
    addMessage(addMessageInput: $addMessageInput)
  }
`;

interface AddMessageVars {
  addMessageInput: {
    chatId: number;
    content: string;
  };
}

interface AddMessageResult {
  addMessage: number;
}

export const useAddMessage = () => {
  const toastId = "add-message-toast";
  const [addMessage, mutation] = useMutation<AddMessageResult, AddMessageVars>(
    ADD_MESSAGE,
    {
      onError: (error) => {
        console.error("Error adding message:", error);
        toast.error(`Error adding message: ${error.message}`, {
          id: toastId,
        });
      },
    }
  );

  return {
    addMessage,
    ...mutation,
  };
};
