 import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PostRepository = {
  async findAll() {
    return prisma.post.findMany({ include: { author: true, likes: true, comments: true } });
  },
  async findById(id: number) {
    return prisma.post.findUnique({ where: { id }, include: { author: true, likes: true, comments: true } });
  },
  async create(data: { content: string; authorId: number }) {
    return prisma.post.create({ data });
  },
  async delete(id: number) {
    return prisma.post.delete({ where: { id } });
  },
}; 
