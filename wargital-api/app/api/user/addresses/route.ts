import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

// Schema validasi untuk POST
const addressSchema = z.object({
    label: z.string().min(1, "Label wajib diisi"),
    recipient: z.string().min(1, "Nama penerima wajib diisi"),
    phone: z.string().min(10, "Nomor telepon tidak valid"),
    fullAddress: z.string().min(1, "Alamat lengkap wajib diisi"),
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

// GET: Ambil daftar alamat user
export async function GET(request: Request) {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: [
            { isPrimary: 'desc' }, // Utama di paling atas
            { createdAt: 'desc' },
        ],
    });

    return NextResponse.json(addresses);
}

// POST: Tambah alamat baru
export async function POST(request: Request) {
    const userId = getUserIdFromRequest(request);

    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { message: 'Data tidak valid', issues: parsed.error.issues },
            { status: 400 }
        );
    }

    const { label, recipient, phone, fullAddress, detail, isPrimary } = parsed.data;

    // Jika alamat baru diset sebagai utama, ubah alamat lain menjadi bukan utama
    if (isPrimary) {
        await prisma.address.updateMany({
            where: { userId, isPrimary: true },
            data: { isPrimary: false },
        });
    }

    // Jika ini alamat pertama, otomatis set jadi utama
    const addressCount = await prisma.address.count({ where: { userId } });
    const shouldBePrimary = isPrimary || addressCount === 0;

    const newAddress = await prisma.address.create({
        data: {
            userId,
            label,
            recipient,
            phone,
            fullAddress,
            detail,
            isPrimary: shouldBePrimary,
        },
    });

    return NextResponse.json(newAddress, { status: 201 });
}
