import { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'eduvaga/avatars', transformation: [{ width: 200, height: 200, crop: 'fill' }] },
        (error, result) => { if (error) reject(error); else resolve(result); }
      ).end(req.file!.buffer);
    }) as any;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: result.secure_url },
    });

    res.json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer upload' });
  }
};

export const removeAvatar = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string);
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
    });
    res.json({ avatarUrl: null });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover foto' });
  }
};