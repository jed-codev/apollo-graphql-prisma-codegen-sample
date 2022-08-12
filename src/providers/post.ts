/* eslint-disable no-async-promise-executor */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface INewPost {
  subject: string;
  content: string;
}

export interface IListOptions {
  order?: ESort;
  offset?: number;
  limit?: number;
}

enum ESort {
  asc,
  desc,
}

export default class Post {
  public async createPost(data: INewPost) {
    const newPost = await prisma.post.create({ data });
    return newPost;
  }

  public async getPostById(id: string) {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    return post;
  }

  public async getPosts(options: IListOptions) {
    const posts = await prisma.post.findMany({
      take: options.limit ? options.limit : 10,
      skip: options.offset ? options.offset : 0,
    });
    return posts;
  }
}
