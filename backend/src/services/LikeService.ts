import { LikeRepository } from '../repositories/LikeRepository';

export const LikeService = {
  async like(userId: number, postId: number) {
    return LikeRepository.create({ userId, postId });
  },

  async unlike(userId: number, postId: number) {
    return LikeRepository.delete(userId, postId);
  },

  async getLikesByPost(postId: number) {
    return LikeRepository.findByPostId(postId);
  },
}; 
