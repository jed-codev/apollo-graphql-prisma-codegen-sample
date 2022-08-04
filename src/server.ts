import { ApolloServer } from "apollo-server";

// import resolvers
import { resolvers } from "./resolvers";

// import schema
import { typeDefs } from "./schema.graphql";

// instantiate the apollo server
const server = new ApolloServer({ typeDefs, resolvers });

// start the graphql server
server.listen().then(({ url }) => {
  // console.log(`Server ready at ${url}`);
});
