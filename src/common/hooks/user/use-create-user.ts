import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";

const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      email
      password
    }
  }
`;

export const useCreateUser = () => {
  const toastId = "create-user-toast";
  const mutation = useMutation(CREATE_USER, {
    onError: (error) => {
      console.log("error", error);

      toast.error(`Error creating user: ${error.message}`, {
        id: toastId,
      });
    },
    onCompleted: () => {
      toast.success("User created successfully", {
        id: toastId,
      });
    },
  });

  return mutation;
};
