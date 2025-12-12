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