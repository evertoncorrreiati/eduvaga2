import { CommentRepository } from '../repositories/CommentRepository';

export const CommentService = {
  async create(content: string, authorId: number, postId: number) {
    return CommentRepository.create({ content, authorId, postId });
  },

  async getByPost(postId: number) {
    return CommentRepository.findByPostId(postId);
  },

  async delete(id: number) {
    return CommentRepository.delete(id);
  },
}; 
