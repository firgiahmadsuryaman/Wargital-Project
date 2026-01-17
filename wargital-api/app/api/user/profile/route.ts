import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const profileSchema = z.object({
    name: z.string().min(1, 'Nama lengkap wajib diisi'),
    phone: z.string().regex(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka').min(10, 'Nomor telepon minimal 10 digit').optional().or(z.literal('')),
});