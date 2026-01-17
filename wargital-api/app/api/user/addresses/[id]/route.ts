import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Schema validasi untuk PUT (semua opsional)
const addressUpdateSchema = z.object({
    label: z.string().min(1).optional(),
    recipient: z.string().min(1).optional(),
    phone: z.string().min(10).optional(),
    fullAddress: z.string().min(1).optional(),
    detail: z.string().optional(),
    isPrimary: z.boolean().optional(),
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

// DELETE: Hapus alamat
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Pastikan alamat milik user yang sedang login
    const existingAddress = await prisma.address.findUnique({
        where: { id },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
        return NextResponse.json({ message: 'Alamat tidak ditemukan' }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });

    return NextResponse.json({ message: 'Alamat berhasil dihapus' });
}

// PUT: Update alamat
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = addressUpdateSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { message: 'Data tidak valid', issues: parsed.error.issues },
            { status: 400 }
        );
    }

    // Pastikan alamat milik user
    const existingAddress = await prisma.address.findUnique({
        where: { id },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
        return NextResponse.json({ message: 'Alamat tidak ditemukan' }, { status: 404 });
    }

    // Jika isPrimary diubah jadi true, update yang lain jadi false
    if (parsed.data.isPrimary) {
        await prisma.address.updateMany({
            where: { userId, isPrimary: true, NOT: { id } },
            data: { isPrimary: false },
        });
    }

    const updatedAddress = await prisma.address.update({
        where: { id },
        data: parsed.data,
    });

    return NextResponse.json(updatedAddress);
}
