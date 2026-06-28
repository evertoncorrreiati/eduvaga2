 import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const CommentRepository = {
  async create(data: { content: string; authorId: number; postId: number }) {
    return prisma.comment.create({ data });
  },
  async findByPostId(postId: number) {
    return prisma.comment.findMany({ where: { postId }, include: { author: true } });
  },
  async delete(id: number) {
    return prisma.comment.delete({ where: { id } });
  },
}; 
