import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const UserService = {
  async register(name: string, email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    return UserRepository.create({ name, email, passwordHash });
  },

  async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('Usuário não encontrado');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Senha incorreta');
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user };
  },

  async getById(id: number) {
    return UserRepository.findById(id);
  },

  async getAll() {
    return UserRepository.findAll();
  },
}; 
