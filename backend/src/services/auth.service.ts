import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/client';
import { config } from '../config/env';

export const registerUser = async (name: string, email: string, password: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    const error = new Error('Email is already registered') as any;
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
    },
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

export const loginUser = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    const error = new Error('Invalid credentials') as any;
    error.status = 401;
    throw error;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    const error = new Error('Invalid credentials') as any;
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '24h' });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};
