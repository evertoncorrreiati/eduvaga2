import { PostRepository } from '../repositories/PostRepository';

export const PostService = {
  async create(content: string, authorId: number) {
    return PostRepository.create({ content, authorId });
  },

  async getAll() {
    return PostRepository.findAll();
  },

  async getById(id: number) {
    return PostRepository.findById(id);
  },

  async delete(id: number) {
    return PostRepository.delete(id);
  },
}; 
