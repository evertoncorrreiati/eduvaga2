import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import prisma from '../prisma';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash }
    });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(400).json({ error: 'Email já cadastrado' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { posts: true, followers: true, following: true }
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log('Tentativa de reset para:', email)
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('Usuário encontrado:', user ? 'sim' : 'não')
    if (!user) {
      return res.json({ message: 'Se o e-mail existir, você receberá um link.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiresAt: expires }
    });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const link = `http://localhost:5173/reset-password?token=${token}`;
    console.log('Enviando e-mail para:', email)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Redefinição de senha - EduVaga',
      html: `
        <h2>Olá, ${user.name}!</h2>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${link}">${link}</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `
    });
    console.log('E-mail enviado com sucesso!')
    res.json({ message: 'Se o e-mail existir, você receberá um link.' });
  } catch (error) {
    console.log('Erro ao enviar e-mail:', error)
    res.status(500).json({ error: 'Erro interno' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiresAt: { gt: new Date() }
      }
    });
    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpiresAt: null }
    });
    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.log('Erro ao redefinir senha:', error)
    res.status(500).json({ error: 'Erro interno' });
  }
};