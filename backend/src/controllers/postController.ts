import { Request, Response } from 'express';
import prisma from '../prisma';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content, officialUrl, modalidade, nivel, userId } = req.body;
    const post = await prisma.post.create({
      data: {
        content,
        officialUrl,
        modalidade: modalidade || null,
        nivel: nivel || null,
        userId: Number(userId)
      },
      include: { user: { select: { id: true, name: true } } }
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar post' });
  }
};

export const getFeed = async (req: Request, res: Response) => {
  try {
    const { modalidade, nivel } = req.query;

    const where: any = {}
    if (modalidade) where.modalidade = modalidade
    if (nivel) where.nivel = nivel

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        likes: true,
        comments: {
          include: { user: { select: { id: true, name: true } } }
        }
      }
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId, userId } = req.body;
    const existing = await prisma.like.findFirst({
      where: { postId: Number(postId), userId: Number(userId) }
    });
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return res.json({ message: 'Like removido' });
    }
    const like = await prisma.like.create({
      data: { postId: Number(postId), userId: Number(userId) }
    });
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao curtir post' });
  }
};

export const commentPost = async (req: Request, res: Response) => {
  try {
    const { content, postId, userId } = req.body;
    const comment = await prisma.comment.create({
      data: { content, postId: Number(postId), userId: Number(userId) },
      include: { user: { select: { id: true, name: true } } }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao comentar' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content, officialUrl, modalidade, nivel, userId } = req.body;

    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    if (post.userId !== Number(userId)) return res.status(403).json({ error: 'Sem permissão' });

    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: { content, officialUrl, modalidade, nivel },
      include: { user: { select: { id: true, name: true } } }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar post' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    if (post.userId !== Number(userId)) return res.status(403).json({ error: 'Sem permissão' });

    await prisma.like.deleteMany({ where: { postId: Number(id) } });
    await prisma.comment.deleteMany({ where: { postId: Number(id) } });
    await prisma.post.delete({ where: { id: Number(id) } });

    res.json({ message: 'Post excluído' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir post' });
  }
};