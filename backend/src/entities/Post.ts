export interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  authorId: number;
  createdAt: Date;
}  
