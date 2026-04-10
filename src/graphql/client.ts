import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://mo-graphql.microapps-staging.com",
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: import.meta.env.VITE_API_KEY,
  },
}));

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
