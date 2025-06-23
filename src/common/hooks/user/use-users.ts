import { gql, TypedDocumentNode, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { User } from "../../interfaces/user";

const GET_USERS: TypedDocumentNode<{ users: User[] }> = gql`
  query Users {
    users {
      id
      email
    }
  }
`;

export const useUsers = () => {
  const toastId = "users-toast";
  const query = useQuery(GET_USERS, {
    onError: (error) => {
      console.error("Error fetching users:", error);
      toast.error(`Error fetching users: ${error.message}`, {
        id: toastId,
      });
    },
    onCompleted: () => {
      toast.success("Users fetched successfully", {
        id: toastId,
      });
    },
  });

  return {
    users: query.data?.users,
    ...query,
  };
};
