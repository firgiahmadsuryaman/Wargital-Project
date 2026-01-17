import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const profileSchema = z.object({
    name: z.string().min(1, 'Nama lengkap wajib diisi'),
    phone: z.string().regex(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka').min(10, 'Nomor telepon minimal 10 digit').optional().or(z.literal('')),
});

const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret';

function getUserIdFromRequest(request: Request): string | null {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded: any = jwt.verify(token, getJwtSecret());
        return decoded.userId;
    } catch (error) {
        return null;
    }
}