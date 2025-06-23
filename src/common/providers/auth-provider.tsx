"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import { apolloClient } from "../api/apollo-client-helper";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { User } from "../interfaces/user";

interface AuthContext {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContext>({
  user: null,
  token: null,
  isLoading: false,
  login: () => {},
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const useSafeUser = () => {
  const { user } = useAuthContext();
  if (!user) {
    throw new Error("useSafeUser must be used within AuthProvider");
  }
  return user;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const invalidateAuth = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
    router.replace("/auth/login");
  };

  useLayoutEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data }: { data: { me: { access_token: string; user: User } } } =
          await apolloClient.query({
            query: gql`
              query Me {
                me {
                  access_token
                  user {
                    id
                    email
                  }
                }
              }
            `,
            // fetchPolicy: "network-only",
          });

        console.log("User data:", data);

        localStorage.setItem("access_token", data.me.access_token);
        setUser(data.me.user);
      } catch (error) {
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { data } = await apolloClient.mutate({
        mutation: gql`
          mutation Login($authInput: AuthInput!) {
            login(authInput: $authInput) {
              access_token
              user {
                id
                email
              }
            }
          }
        `,
        variables: {
          authInput: {
            email,
            password,
          },
        },
      });

      console.log("Login data:", data);

      localStorage.setItem("access_token", data.login.access_token);
      setUser(data.login.user);
      router.push("/dashboard");
    } catch (err) {
      invalidateAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => invalidateAuth();

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
