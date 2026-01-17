import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const paymentMethodSchema = z.object({
    type: z.enum(['E_WALLET', 'BANK_TRANSFER', 'CARD']), // Sesuaikan dengan enum jika ada, atau string
    provider: z.string().min(1, 'Provider wajib diisi'),
    accountNumber: z.string().min(1, 'Nomor akun/rekening wajib diisi'),
    accountName: z.string().min(1, 'Nama pemilik akun wajib diisi'),
    isPrimary: z.boolean().optional(),
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

// GET: Ambil daftar metode pembayaran user
export async function GET(request: Request) {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const methods = await prisma.paymentMethod.findMany({
        where: { userId },
        orderBy: [
            { isPrimary: 'desc' }, // Primary first
            { createdAt: 'desc' }
        ],
    });

    return NextResponse.json(methods);
}

// POST: Tambah metode pembayaran baru
export async function POST(request: Request) {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const parsed = paymentMethodSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { message: 'Data tidak valid', errors: parsed.error.errors },
                { status: 400 }
            );
        }

        const { type, provider, accountNumber, accountName, isPrimary } = parsed.data;

        // Jika user set sebagai primary, atau ini adalah metode pertama, maka set primary
        // Jika set primary, update metode lain jadi false dulu

        // Cek jumlah metode
        const count = await prisma.paymentMethod.count({ where: { userId } });
        const shouldBePrimary = isPrimary || count === 0;

        if (shouldBePrimary) {
            await prisma.paymentMethod.updateMany({
                where: { userId },
                data: { isPrimary: false }
            });
        }

        const newMethod = await prisma.paymentMethod.create({
            data: {
                userId,
                type,
                provider,
                accountNumber,
                accountName,
                isPrimary: shouldBePrimary,
            },
        });

        return NextResponse.json(newMethod, { status: 201 });
    } catch (error) {
        console.error('POST PaymentMethod Error', error);
        return NextResponse.json({ message: 'Gagal menambah metode pembayaran' }, { status: 500 });
    }
}
