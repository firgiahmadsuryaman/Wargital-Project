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
  const body = await request.json(); // Ambil body request
  const parsed = schema.safeParse(body); // Validasi body

  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Payload tidak valid', issues: parsed.error.issues },
      { status: 400 }
    ); // Jika validasi gagal
  }