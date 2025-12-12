import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Validasi input login
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Mengambil JWT secret dari environment
const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret';

// Handler login (POST)
export async function POST(request: Request) {
  const body = await request.json(); 
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Payload tidak valid', issues: parsed.error.issues },
      { status: 400 }
    ); // Jika validasi gagal
  }
    const { email, password } = parsed.data; 
  const user = await prisma.user.findUnique({ where: { email } }); 

  if (!user) {
    return NextResponse.json(
      { message: 'Email atau kata sandi salah' },
      { status: 401 }
    ); // User tidak ditemukan
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json(
      { message: 'Email atau kata sandi salah' },
      { status: 401 }
    ); // Password salah
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    getJwtSecret(),
    { expiresIn: '7d' }
  ); // Generate JWT

  return NextResponse.json({
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    token,
  }); // Return token + data user
}