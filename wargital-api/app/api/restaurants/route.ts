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

export const dynamic = 'force-dynamic';

// Handler GET untuk mengambil daftar restoran
export async function GET(request: Request) {
  const userId = getUserIdFromRequest(request);
  console.log('GET /api/restaurants - UserId:', userId);

  // Ambil semua restoran beserta menunya dari database
  const restaurants = await prisma.restaurant.findMany({
    include: { menuItems: true },
    orderBy: { name: 'asc' },
  });

  // Jika user login, ambil daftar ID restoran dan MENU yang difavoritkan
  let favoriteRestaurantIds = new Set<string>();
  let favoriteMenuItemIds = new Set<string>();

  if (userId) {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      select: { restaurantId: true, menuItemId: true },
    });
    console.log('User Favorites:', favorites);
    favorites.forEach(fav => {
      if (fav.restaurantId) favoriteRestaurantIds.add(fav.restaurantId);
      if (fav.menuItemId) favoriteMenuItemIds.add(fav.menuItemId);
    });
  }

  // Mapping menuItems menjadi menu dan set isFavorite (untuk Resto & Menu)
  const mapped = restaurants.map((restaurant: any) => ({
    ...restaurant,
    menu: restaurant.menuItems.map((item: any) => ({
      ...item,
      isFavorite: favoriteMenuItemIds.has(item.id)
    })),
    isFavorite: favoriteRestaurantIds.has(restaurant.id),
  }));

  // Return daftar restoran
  return NextResponse.json(mapped);
}
