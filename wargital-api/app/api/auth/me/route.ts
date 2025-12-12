import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

// Mengambil JWT secret dari environment
const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret';

// Handler GET untuk mengambil data user dari token
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization'); 

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Tidak ada token' }, { status: 401 }); 
  }

  const token = authHeader.replace('Bearer ', ''); 

  try {
    const payload = jwt.verify(token, getJwtSecret()) as { sub: string }; 

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, createdAt: true },
    }); 

    if (!user) {
      return NextResponse.json({ message: 'Pengguna tidak ditemukan' }, { status: 404 }); 
    }

    return NextResponse.json({ user }); 
  } catch (error) {
    return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 });
  }
}