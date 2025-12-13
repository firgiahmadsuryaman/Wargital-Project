
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


}
