import { ApolloServer } from "apollo-server";

// import resolvers
import { resolvers } from "./resolvers";

import { loadFiles } from "@graphql-tools/load-files";
import { DocumentNode } from "graphql";

const app = async () => {
  const typeDefs = (await loadFiles(
    "src/type-defs/*.schema.graphql"
  )) as DocumentNode[];

  // instantiate the apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // start the graphql server
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

app();
