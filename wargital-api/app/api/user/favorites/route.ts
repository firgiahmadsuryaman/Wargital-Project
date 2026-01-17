import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const favoriteSchema = z.object({
    restaurantId: z.string().min(1, "Restaurant ID wajib diisi"),
});

const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret';

function getUserIdFromRequest(request: Request): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.replace('Bearer ', '');
    try {
        const payload = jwt.verify(token, getJwtSecret()) as { sub: string };
        return payload.sub;
    } catch {
        return null;
    }
}

// GET: Ambil daftar restoran favorit user
export async function GET(request: Request) {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
            restaurant: true, // Include data restoran
        },
        orderBy: { createdAt: 'desc' },
    });


    return NextResponse.json(favorites);
}

// POST: Tambah ke favorit
export async function POST(request: Request) {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = favoriteSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { message: 'Data tidak valid', issues: parsed.error.issues },
            { status: 400 }
        );
    }

    const { restaurantId } = parsed.data;

    // Cek apakah sudah ada
    const existing = await prisma.favorite.findUnique({
        where: {
            userId_restaurantId: {
                userId,
                restaurantId,
            },
        },
    });

    if (existing) {
        return NextResponse.json({ message: 'Sudah menjadi favorit' }, { status: 200 });
    }

    const favorite = await prisma.favorite.create({
        data: {
            userId,
            restaurantId,
        },
    });

    return NextResponse.json(favorite, { status: 201 });
}
