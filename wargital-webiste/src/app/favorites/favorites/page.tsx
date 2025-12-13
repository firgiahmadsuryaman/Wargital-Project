
'use client';

import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MenuItemCard from '@/components/menu-item-card';
import type { MenuItem } from '@/lib/types';
import { fetchRestaurants } from '@/lib/data';
import { useFavorites } from '@/context/favorites-context';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favoriteMenuItems, setFavoriteMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      const restaurants = await fetchRestaurants();
      const allMenuItems = restaurants.flatMap((r) => r.menu);
      const filtered = allMenuItems.filter((item) => favorites.includes(item.id));
      setFavoriteMenuItems(filtered);
      setIsLoading(false);
    };

    void loadFavorites();
  }, [favorites]);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[calc(100vh-10rem)] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Menu Favorit Saya</h1>
      {favoriteMenuItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteMenuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 min-h-[calc(100vh-20rem)]">
          <Heart className="h-24 w-24 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-semibold">Belum Ada Favorit</h2>
          <p className="mt-2 text-muted-foreground">
            Klik ikon hati pada item menu untuk menyimpannya di sini.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Temukan Sesuatu yang Lezat</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
