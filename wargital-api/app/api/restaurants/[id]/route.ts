import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tipe parameter route (dynamic route)
type Params = {
  params: {
    id: string;
  };
};

// Handler GET untuk mengambil detail restoran berdasarkan ID
export async function GET(_: Request, { params }: Params) {
    // Ambil data restoran beserta menu
    const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.id },
    include: { menuItems: true },
  });

  // Jika restoran tidak ditemukan
   if (!restaurant) {
    return NextResponse.json(
      { message: 'Restoran tidak ditemukan' },
      { status: 404 }
    ); 
  }

// Return detail restoran
  return NextResponse.json({
    ...restaurant,
    menu: restaurant.menuItems,
  });
}