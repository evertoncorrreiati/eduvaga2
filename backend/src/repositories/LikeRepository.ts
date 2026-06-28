 import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const LikeRepository = {
  async create(data: { userId: number; postId: number }) {
    return prisma.like.create({ data });
  },
  async delete(userId: number, postId: number) {
    return prisma.like.deleteMany({ where: { userId, postId } });
  },
  async findByPostId(postId: number) {
    return prisma.like.findMany({ where: { postId } });
  },
}; 
