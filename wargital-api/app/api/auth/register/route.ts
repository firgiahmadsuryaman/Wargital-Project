import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Validasi input untuk registrasi
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Mengambil JWT secret dari environment
const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret';

// Handler POST untuk registrasi user baru
export async function POST(request: Request) {
  const body = await request.json(); 
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Payload tidak valid', issues: parsed.error.issues },
      { status: 400 }
    ); 
  }

  const { email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { message: 'Email sudah terdaftar' },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10); 

  const user = await prisma.user.create({
    data: { email, passwordHash },
    select: { id: true, email: true, createdAt: true },
  }); 

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    getJwtSecret(),
    { expiresIn: '7d' }
  ); 

  return NextResponse.json({ user, token }, { status: 201 }); 
}