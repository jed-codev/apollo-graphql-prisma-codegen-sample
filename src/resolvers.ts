import { PrismaClient } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    users: async () => {
      const users = await prisma.user.findMany();
      if (!users) {
        throw new Error("No users found");
      }
      return users;
    },
    user: async (_, { id }) => {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
  },
  Mutation: {
    loginUser: async (_: null, args: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
        },
      });
      if (!user) {
        throw new Error(`No user found for email: ${args.email}`);
      }
      const valid = await bcrypt.compare(args.password, user.password || "");
      if (!valid) {
        throw new Error("Invalid password");
      }
      const jwtSecret = !process.env.JWT_SECRET
        ? "secret"
        : process.env.JWT_SECRET;
      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "1h",
      });
      const cookie = `Authorization=${token}; HttpOnly; Max-Age=3600;`;
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
        cookie,
      };
    },
    createUser: async (
      _: null,
      args: { name: string; email: string; password: string }
    ) => {
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      });
      if (user) {
        throw new Error(`User with email: ${args.email} already exists`);
      }
      const hashedPassword = await bcrypt.hash(args.password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      return newUser;
    },
    updateUser: async (
      _: null,
      args: { id: number; name?: string; email?: string; password?: string }
    ) => {
      const user = await prisma.user.findUnique({ where: { id: args.id } });
      if (!user) {
        throw new Error(`No user found for id: ${args.id}`);
      }
      let hashedPassword = user.password;
      if (args.password) {
        hashedPassword = await bcrypt.hash(args.password, 10);
      }
      if (args.email) {
        const userByEmail = await prisma.user.findUnique({
          where: { email: args.email },
        });
        if (userByEmail) {
          throw new Error(`User with email: ${args.email} already exists`);
        }
      }
      const updatedUser = await prisma.user.update({
        where: { id: args.id },
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      return updatedUser;
    },
    deleteUser: async (_: null, args: { id: number }) => {
      const user = await prisma.user.findUnique({ where: { id: args.id } });
      if (!user) {
        throw new Error(`No user found for id: ${args.id}`);
      }
      const deletedUser = await prisma.user.delete({ where: { id: args.id } });
      return deletedUser;
    },
  },
};
