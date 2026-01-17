import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

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


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ restaurantId: string }> }
) {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { restaurantId } = await params;

    try {
        await prisma.favorite.delete({
            where: {
                userId_restaurantId: {
                    userId,
                    restaurantId,
                },
            },
        });
        return NextResponse.json({ message: 'Berhasil dihapus dari favorit' });
    } catch (error) {
        // P2025: Record to delete does not exist
        return NextResponse.json({ message: 'Item tidak ditemukan di favorit' }, { status: 404 });
    }
}
