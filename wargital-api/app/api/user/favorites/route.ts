import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const favoriteSchema = z.object({
    restaurantId: z.string().optional(),
    menuItemId: z.string().optional(),
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
            menuItem: true,   // Include data menu item
        },
        orderBy: { createdAt: 'desc' },
    });

    // Map result: kembalikan list restoran DAN list menu
    // Tapi untuk simpelnya, kita bisa return struktur raw favorit, 
    // karena di frontend halaman favorit mungkin dipisah tabnya (Restoran | Menu).
    // Atau frontend yang filter.
    // Untuk kompatibilitas yang ada (getFavorites di service return Restaurant[]),
    // Mari kita modifikasi service di frontend saja nanti untuk handle format baru.
    // Return as is for flexibility.
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

    if (!parsed.data.restaurantId && !parsed.data.menuItemId) {
        return NextResponse.json(
            { message: 'Wajib menyertakan id restoran atau menu item' },
            { status: 400 }
        );
    }

    const { restaurantId, menuItemId } = parsed.data;
    let whereClause = {};

    if (menuItemId) {
        whereClause = {
            userId,
            menuItemId
        }
    } else {
        whereClause = {
            userId,
            restaurantId
        }
    }

    // Cek apakah sudah ada
    const existing = await prisma.favorite.findFirst({
        where: whereClause,
    });

    if (existing) {
        return NextResponse.json({ message: 'Sudah menjadi favorit' }, { status: 200 });
    }

    const favorite = await prisma.favorite.create({
        data: {
            userId,
            restaurantId,
            menuItemId,
        },
    });

    return NextResponse.json(favorite, { status: 201 });
}

// DELETE: Hapus favorit (Restaurant atau Menu Item) via Query Params
// Contoh: DELETE /api/user/favorites?restaurantId=123
// Contoh: DELETE /api/user/favorites?menuItemId=456
export async function DELETE(request: Request) {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const menuItemId = searchParams.get('menuItemId');

    if (!restaurantId && !menuItemId) {
        return NextResponse.json({ message: 'Parameter restaurantId atau menuItemId diperlukan' }, { status: 400 });
    }

    let whereClause = {};

    if (menuItemId) {
        whereClause = {
            userId,
            menuItemId
        }
    } else {
        whereClause = {
            userId,
            resturantId: restaurantId // Note: Prisma generated field for restaurantId might be distinct if not using @@unique.
            // Wait, without @@unique, we can't use delete({where: ...}) easily unless we know the ID.
            // We must use deleteMany because userId+restaurantId is not guaranteed unique in Prisma schema (though logic enforces it).
            // deleteMany is safer here.
        }
        // Correction: My previous schema update removed @@unique. So I cannot use delete with composite key unique.
        // I must use deleteMany.
    }

    // Re-construct where clause properly
    const where: any = { userId };
    if (menuItemId) where.menuItemId = menuItemId;
    if (restaurantId) where.restaurantId = restaurantId;

    try {
        await prisma.favorite.deleteMany({
            where,
        });
        return NextResponse.json({ message: 'Berhasil dihapus dari favorit' });
    } catch (error) {
        console.error('DELETE Error', error);
        return NextResponse.json({ message: 'Gagal menghapus' }, { status: 500 });
    }
}
