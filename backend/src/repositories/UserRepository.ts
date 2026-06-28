import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserRepository = {
  async findAll() {
    return prisma.user.findMany();
  },
  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  async create(data: { name: string; email: string; passwordHash: string }) {
    return prisma.user.create({ data });
  },
};  
