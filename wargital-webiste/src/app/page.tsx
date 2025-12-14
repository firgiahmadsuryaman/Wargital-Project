
'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getHeroImage, FALLBACK_IMAGES } from '../lib/images';
import { HeroSection } from '@/components/layout/hero-section';
import MenuItemCard from '../components/menu-item-card';
import { MapPin, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import type { Restaurant } from '../lib/types';
import { fetchRestaurants } from '../lib/data';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRestaurants();
        setRestaurant(data[0] ?? null);
      } catch (err: any) {
        console.error("Failed to load restaurant data:", err);
        setError("Gagal memuat data restoran. Pastikan server API berjalan.");
      } finally {
        setIsLoading(false);
      }
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

  // Hero Logic moved to component

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[calc(100vh-10rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="mt-4 text-muted-foreground">Memuat menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[calc(100vh-10rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center text-center p-6 border border-destructive/50 rounded-lg bg-destructive/10">
          <h3 className="text-xl font-bold text-destructive mb-2">Terjadi Kesalahan</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex h-full min-h-[calc(100vh-10rem)] w-full items-center justify-center">
        <p className="text-muted-foreground">Restoran tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />

      <div className="container mx-auto px-4 md:px-6 py-12">
        <section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-headline">Menu Unggulan</h2>
              <div className="flex items-center text-lg text-muted-foreground">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <span>{restaurant.distance} dari lokasi Anda</span>
              </div>
            </div>
            <div className="relative mt-4 md:mt-0 w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari menu..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredMenu.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMenu.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-lg p-12 min-h-[20rem]">
              <Search className="h-24 w-24 text-muted-foreground" />
              <h2 className="mt-6 text-2xl font-semibold">Menu Tidak Ditemukan</h2>
              <p className="mt-2 text-muted-foreground">
                Tidak ada menu yang cocok dengan pencarian &quot;{searchQuery}&quot;.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
