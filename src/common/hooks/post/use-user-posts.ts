import { gql, TypedDocumentNode, useQuery } from "@apollo/client";
import { toast } from "sonner";

export const GET_USER_POSTS: TypedDocumentNode<GetUserPosts> = gql`
  query Posts {
    postsByUserId {
      id
      content
      description
    }
  }
`;

export const useUserPosts = () => {
  const toastId = "posts-toast";

  const query = useQuery<GetUserPostsResult>(GET_USER_POSTS, {
    onError: (error) => {
      toast.error(`Error fetching posts: ${error.message}`, {
        id: toastId,
      });
    },
    onCompleted: () => {
      toast.success("posts fetched successfully", {
        id: toastId,
      });
    },
  });

  // Uncomment for debugging only
  // console.log("useUserPosts query:", query.data);

  return {
    posts: query.data?.postsByUserId,
    ...query,
  };
};

interface GetUserPosts {
  postsByUserId: {
    id: number;
    content: string;
    description?: string;
  }[];
}

interface GetUserPostsResult extends GetUserPosts {}
