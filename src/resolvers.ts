import { PrismaClient } from "@prisma/client";
import Post from "./providers/post";
import * as postValidators from "./validators/post";
import { validateArgs } from "./utils/helpers";
import type { Resolvers } from "./utils/resolver-types";

export const resolvers: Resolvers = {
  Query: {
    post: async (_, { id }) => {
      try {
        const post = await new Post().getPostById(id);
        return post;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    posts: async (_, args: any) => {
      try {
        const post = await new Post().getPosts(args.options);
        return post;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    createPost: async (_, args: any) => {
      try {
        validateArgs(postValidators.createPost, args.data);
        const post = await new Post().createPost(args.data);
        return post;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
