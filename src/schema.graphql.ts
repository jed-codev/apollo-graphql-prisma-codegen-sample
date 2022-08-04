import { gql } from "apollo-server";

export const typeDefs = gql`
  type User {
    id: Int!
    name: String
    email: String
    password: String
    createdAt: String
    updatedAt: String
  }
  type Auth {
    user: User
    token: String
    cookie: String
  }
  type Query {
    users: [User]
    user(id: Int!): User
  }
  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
    loginUser(email: String!, password: String!): Auth
    updateUser(id: Int!, name: String, email: String, password: String): User
    deleteUser(id: Int!): User
  }
`;
