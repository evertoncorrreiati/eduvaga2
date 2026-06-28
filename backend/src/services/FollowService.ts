import { FollowRepository } from '../repositories/FollowRepository';

export const FollowService = {
  async follow(followerId: number, followingId: number) {
    return FollowRepository.create({ followerId, followingId });
  },

  async unfollow(followerId: number, followingId: number) {
    return FollowRepository.delete(followerId, followingId);
  },

  async getFollowers(userId: number) {
    return FollowRepository.findFollowers(userId);
  },

  async getFollowing(userId: number) {
    return FollowRepository.findFollowing(userId);
  },
}; 
