 export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
} 
