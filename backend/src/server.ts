import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login, getProfile, forgotPassword, resetPassword } from './controllers/userController';
import { createPost, getFeed, likePost, commentPost, updatePost, deletePost } from './controllers/postController';
import { followUser } from './controllers/followController';
import { upload, uploadAvatar, removeAvatar } from './controllers/uploadController';
import { authMiddleware } from './middleware/authMiddleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas públicas (não precisam de login)
app.post('/auth/register', register);
app.post('/auth/login', login);
app.post('/auth/forgot-password', forgotPassword);
app.post('/auth/reset-password', resetPassword);
app.get('/feed', getFeed);
app.get('/users/:id', getProfile);

// Rotas protegidas (precisam de token JWT)
app.post('/users/:id/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
app.delete('/users/:id/avatar', authMiddleware, removeAvatar);

app.post('/posts', authMiddleware, createPost);
app.post('/posts/like', authMiddleware, likePost);
app.post('/posts/comment', authMiddleware, commentPost);
app.put('/posts/:id', authMiddleware, updatePost);
app.delete('/posts/:id', authMiddleware, deletePost);

app.post('/follow', authMiddleware, followUser);

app.get('/', (req, res) => {
  res.json({ message: 'EduVaga API funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;