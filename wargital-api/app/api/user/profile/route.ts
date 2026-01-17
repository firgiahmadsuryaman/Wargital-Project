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

// GET: Ambil profil user
export async function GET(request: Request) {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('GET Profile Error', error);
        return NextResponse.json({ message: 'Gagal mengambil profil' }, { status: 500 });
    }
}

// PUT: Update profil user
export async function PUT(request: Request) {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const parsed = profileSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Data tidak valid', errors: parsed.error.errors },
                { status: 400 }
            );
        }

        const { name, phone } = parsed.data;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                phone: phone || null, // Handle empty string as null if needed, or keep as string
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
            },
        });

        return NextResponse.json(updatedUser);