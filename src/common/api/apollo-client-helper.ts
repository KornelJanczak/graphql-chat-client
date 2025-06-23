import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  Context,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  uri: "http://localhost:5021/graphql",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:5021/graphql",
    connectionParams: () => {
      const token = localStorage.getItem("access_token");
      return {
        Authorization: token ? `Bearer ${token}` : "",
      };
    },
  })
);

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("access_token");
  operation.setContext((context: Context) => {
    return {
      headers: {
        ...context.headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return forward(operation);
});

const responseLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    // Tutaj możesz zmodyfikować odpowiedź
    console.log("GraphQL Response:", response);

    // Obsługa błędów globalnie
    if (response.errors) {
      // Np. obsługa błędów autoryzacji
      if (response.errors.some((err) => err.message.includes("Unauthorized"))) {
        // Przekieruj do strony logowania lub odśwież token

        localStorage.removeItem("access_token");

        // localStorage.removeItem("access_token");
        // window.location.href = "/auth/login";
      }
    }

    // Możesz też modyfikować dane w odpowiedzi
    if (response.data) {
      // Modyfikacja danych...
    }

    return response;
  });
});

const httpChain = from([responseLink, authLink, httpLink]);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpChain
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
