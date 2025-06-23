import { gql, TypedDocumentNode, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Post } from "@/common/interfaces/post";
import { GET_USER_POSTS } from "./use-user-posts";

const CREATE_POST: TypedDocumentNode<CreatePostInput, CreatePostVars> = gql`
  mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      id
    }
  }
`;

export const useCreatePost = () => {
  const toastId = "create-post-toast";
  const mutation = useMutation<CreatePostResult, CreatePostVars>(CREATE_POST, {
    onError: (error) => {
      toast.error(`Error creating post: ${error.message}`, {
        id: toastId,
      });
    },
    onCompleted: () => {
      toast.success("Post created successfully", {
        id: toastId,
      });
    },
    refetchQueries: [GET_USER_POSTS],
    awaitRefetchQueries: false,
  });

  return mutation;
};

interface CreatePostInput extends Omit<Post, "id" | "userId"> {}

interface CreatePostVars {
  createPostInput: CreatePostInput;
}

interface CreatePostResult {
  createPost: {
    id: string;
    content: string;
    description: string;
  };
}
