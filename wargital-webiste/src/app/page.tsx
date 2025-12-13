
'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getHeroImage, FALLBACK_IMAGES } from '@/lib/images';
import MenuItemCard from '@/components/menu-item-card';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Restaurant } from '@/lib/types';
import { fetchRestaurants } from '@/lib/data';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchRestaurants();
      setRestaurant(data[0] ?? null);
      setIsLoading(false);
    };

    void loadData();
  }, []);

  const filteredMenu = useMemo(() => {
    if (!restaurant) return [];
    if (!searchQuery) {
      return restaurant.menu;
    }
    return restaurant.menu.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, restaurant?.menu]);
  
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');
  const heroImageUrl = heroImage?.imageUrl || getHeroImage('hero-1.jpg') || FALLBACK_IMAGES.hero;

  if (isLoading || !restaurant) {
    return (
      <div className="flex h-full min-h-[calc(100vh-10rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="mt-4 text-muted-foreground">Memuat menu...</p>
        </div>
      </div>
    );
  }


}
