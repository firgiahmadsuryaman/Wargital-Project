import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tipe parameter route (dynamic route)
// Handler GET untuk mengambil detail restoran berdasarkan ID
export async function GET(_: Request, context: { params: any }) {
  // params can be a Promise or an object depending on Next's typing, so await it
  const params = await context.params;

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