import { gql, TypedDocumentNode, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Post } from "../../interfaces/post";
import { GET_USER_POSTS } from "./use-user-posts";

const UPDATE_POST: TypedDocumentNode<UpdatePostResult, UpdatePostVars> = gql`
  mutation UpdatePost($updatePostInput: UpdatePostInput!) {
    updatePost(updatePostInput: $updatePostInput)
  }
`;

export const useEditPost = () => {
  const toastId = "edit-post-toast";
  const mutation = useMutation<UpdatePostResult, UpdatePostVars>(UPDATE_POST, {
    onError: (error) => {
      toast.error(`Error updating post: ${error.message}`, {
        id: toastId,
      });
    },
    onCompleted: () => {
      toast.success("Post updated successfully", {
        id: toastId,
      });
    },
    refetchQueries: [GET_USER_POSTS],
    awaitRefetchQueries: false,
  });

  return mutation;
};

interface UpdatePostInput extends Partial<Omit<Post, "userId">> {
  id: number;
}

interface UpdatePostVars {
  updatePostInput: UpdatePostInput;
}

interface UpdatePostResult {
  updatePost: {
    id: number;
    content: string;
    description?: string;
  };
}
