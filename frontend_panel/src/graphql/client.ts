import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { addMocksToSchema } from "@graphql-tools/mock";
import { typeDefs } from "./schema";
import { mocks } from "./mocks";

// Create executable schema with mocks
const schema = makeExecutableSchema({ typeDefs });
const schemaWithMocks = addMocksToSchema({
  schema,
  mocks,
  preserveResolvers: true,
});

// Create Apollo Client with mocked schema
export const client = new ApolloClient({
  link: new SchemaLink({ schema: schemaWithMocks }),
  cache: new InMemoryCache(),
});
