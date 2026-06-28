import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const FollowRepository = {
  async create(data: { followerId: number; followingId: number }) {
    return prisma.follow.create({ data });
  },
  async delete(followerId: number, followingId: number) {
    return prisma.follow.deleteMany({ where: { followerId, followingId } });
  },
  async findFollowers(followingId: number) {
    return prisma.follow.findMany({ where: { followingId }, include: { follower: true } });
  },
  async findFollowing(followerId: number) {
    return prisma.follow.findMany({ where: { followerId }, include: { following: true } });
  },
}; 
