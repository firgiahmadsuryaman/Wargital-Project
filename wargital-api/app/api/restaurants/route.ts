import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handler GET untuk mengambil daftar restoran
export async function GET() {
    
    // Ambil semua restoran beserta menunya dari database
    const restaurants = await prisma.restaurant.findMany({
    include: { menuItems: true },
    orderBy: { name: 'asc' },
  }); 

   // Mapping menuItems menjadi menu
  const mapped = restaurants.map((restaurant) => ({
    ...restaurant,
    menu: restaurant.menuItems,
  }));
}
