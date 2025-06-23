import { gql, TypedDocumentNode, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { GET_USER_POSTS } from "./use-user-posts";

const DELETE_POST: TypedDocumentNode<DeletePostResult, DeletePostVars> = gql`
  mutation RemovePost($removePostId: Int!) {
    removePost(id: $removePostId) {
      id
    }
  }
`;

export const useDeletePost = () => {
  const toastId = "delete-post-toast";
  const mutation = useMutation<DeletePostResult, DeletePostVars>(DELETE_POST, {
    onError: (error) => {
      toast.error(`Error deleting post: ${error.message}`, {
        id: toastId,
      });
    },
    onCompleted: () => {
      toast.success("Post deleted successfully", {
        id: toastId,
      });
    },
    update: (cache, { data }) => {
      if (data) {
        // Read existing posts from cache
        const existingData = cache.readQuery<{
          postsByUserId: Array<{
            id: number;
            content: string;
            description?: string;
          }>;
        }>({
          query: GET_USER_POSTS,
        });

        // Filter out the deleted post
        if (existingData && existingData.postsByUserId) {
          cache.writeQuery({
            query: GET_USER_POSTS,
            data: {
              postsByUserId: existingData.postsByUserId.filter(
                (post) => post.id !== data.removePost.id
              ),
            },
          });
        }
      }
    },
  });

  return mutation;
};

interface DeletePostVars {
  removePostId: number;
}

interface DeletePostResult {
  removePost: {
    id: number;
  };
}
