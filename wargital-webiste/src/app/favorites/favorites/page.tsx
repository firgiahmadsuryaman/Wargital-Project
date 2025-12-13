
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

  